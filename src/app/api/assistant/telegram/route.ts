import { timingSafeEqual } from 'crypto'
import { after } from 'next/server'

import { env } from '@/env'
import { readMessage } from '@/lib/assistant/guard'
import { cannedReply } from '@/lib/assistant/replies'
import { reply } from '@/lib/assistant/run'
import { loadSettings } from '@/lib/assistant/store'
import { readUpdate, type BotEvent } from '@/lib/assistant/telegram-update'
import { callTelegram } from '@/lib/telegram'

export const maxDuration = 60

function secretMatches(received: string | null, expected: string) {
  const a = Buffer.from(received ?? '')
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

async function answer(event: Exclude<BotEvent, { kind: 'ignore' }>, token: string) {
  const send = (text: string) => callTelegram(token, 'sendMessage', { chat_id: event.chatId, text })

  if (event.kind === 'start') {
    const settings = await loadSettings(event.locale)
    return send(settings.greeting)
  }
  if (event.kind === 'unsupported') return send(cannedReply('textOnly', event.locale, ''))

  const message = readMessage(event.text)
  if (!message.ok) {
    return message.reason === 'tooLong' ? send(cannedReply('tooLong', event.locale, '')) : null
  }

  await callTelegram(token, 'sendChatAction', { chat_id: event.chatId, action: 'typing' }).catch(
    () => null,
  )
  let text = ''
  for await (const chunk of reply({
    channel: 'telegram',
    externalId: event.chatId,
    locale: event.locale,
    text: message.text,
  })) {
    text += chunk
  }
  return send(text.trim())
}

export async function POST(request: Request) {
  const secret = env.TELEGRAM_WEBHOOK_SECRET
  const token = env.TELEGRAM_BOT_TOKEN
  if (!secret || !token) return new Response('Not found', { status: 404 })

  if (!secretMatches(request.headers.get('x-telegram-bot-api-secret-token'), secret)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const event = readUpdate(await request.json().catch(() => null))
  if (event.kind !== 'ignore') {
    after(() =>
      answer(event, token).catch((error) => console.error('Telegram reply failed', error)),
    )
  }
  return new Response('ok')
}
