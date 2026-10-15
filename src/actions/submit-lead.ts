'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { env } from '@/env'
import { clientIp, hashClient } from '@/lib/client'
import { leadFieldErrors, leadSchema, readLeadForm, type LeadField } from '@/lib/lead'
import { formatLeadMessage, sendToTelegram } from '@/lib/telegram'

export type LeadState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'invalid'; fields: Partial<Record<LeadField, true>> }
  | { status: 'error'; reason: 'tooFast' | 'rateLimited' | 'server' }

const MIN_FILL_TIME = 3000
const RATE_WINDOW = 10 * 60 * 1000
const RATE_LIMIT = 3

export async function submitLead(_previous: LeadState, formData: FormData): Promise<LeadState> {
  if (formData.get('company')) return { status: 'success' }

  const fillTime = Number(formData.get('fillTime'))
  if (!(fillTime >= MIN_FILL_TIME)) {
    return { status: 'error', reason: 'tooFast' }
  }

  const parsed = leadSchema.safeParse(readLeadForm(formData))
  if (!parsed.success) return { status: 'invalid', fields: leadFieldErrors(parsed.error) }
  const lead = parsed.data

  const ipHash = hashClient(clientIp(await headers()), env.PAYLOAD_SECRET)

  try {
    const payload = await getPayload({ config })
    const recent = await payload.count({
      collection: 'leads',
      where: {
        and: [
          { ipHash: { equals: ipHash } },
          { createdAt: { greater_than: new Date(Date.now() - RATE_WINDOW).toISOString() } },
        ],
      },
    })
    if (recent.totalDocs >= RATE_LIMIT) return { status: 'error', reason: 'rateLimited' }

    await payload.create({
      collection: 'leads',
      data: { ...lead, ipHash, status: 'new' },
    })
  } catch (error) {
    console.error('Could not save the lead', error)
    return { status: 'error', reason: 'server' }
  }

  try {
    await sendToTelegram(formatLeadMessage(lead), {
      token: env.TELEGRAM_BOT_TOKEN,
      chatId: env.TELEGRAM_CHAT_ID,
    })
  } catch (error) {
    console.error('Telegram notification failed', error)
  }

  return { status: 'success' }
}
