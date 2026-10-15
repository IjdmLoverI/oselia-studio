import { z } from 'zod'

import { env } from '@/env'
import { readMessage } from '@/lib/assistant/guard'
import { cannedReply } from '@/lib/assistant/replies'
import { reply } from '@/lib/assistant/run'
import { clientIp, hashClient } from '@/lib/client'

export const maxDuration = 60

const bodySchema = z.object({
  conversationId: z.uuid(),
  locale: z.enum(['uk', 'en']),
  message: z.unknown(),
})

const textHeaders = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return !origin || new URL(origin).host === new URL(request.url).host
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 })

  const body = bodySchema.safeParse(await request.json().catch(() => null))
  if (!body.success) return new Response('Bad request', { status: 400 })
  const { conversationId, locale } = body.data

  const message = readMessage(body.data.message)
  if (!message.ok) {
    return message.reason === 'tooLong'
      ? new Response(cannedReply('tooLong', locale, ''), { headers: textHeaders })
      : new Response('Bad request', { status: 400 })
  }

  const chunks = reply({
    channel: 'web',
    externalId: conversationId,
    locale,
    text: message.text,
    ipHash: hashClient(clientIp(request.headers), env.PAYLOAD_SECRET),
  })
  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { value, done } = await chunks.next()
        if (done) controller.close()
        else controller.enqueue(encoder.encode(value))
      } catch (error) {
        console.error('Assistant stream failed', error)
        controller.error(error)
      }
    },
    async cancel() {
      await chunks.return(undefined)
    },
  })

  return new Response(stream, { headers: textHeaders })
}
