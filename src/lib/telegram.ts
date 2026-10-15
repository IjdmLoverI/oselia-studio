import type { LeadInput } from './lead'
import type { RenovationType } from './pricing'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const typeLabels = { cosmetic: 'косметичний', capital: 'капітальний', designer: 'дизайнерський' }

export function formatLeadMessage(lead: LeadInput) {
  const lines = [
    '<b>Нова заявка з сайту</b>',
    `👤 ${escapeHtml(lead.name)}`,
    `📞 ${escapeHtml(lead.phone)}`,
  ]

  if (lead.area || lead.renovationType) {
    const parts = [
      lead.area ? `${lead.area} м²` : null,
      lead.renovationType ? typeLabels[lead.renovationType] : null,
    ].filter(Boolean)
    lines.push(`📐 ${parts.join(', ')}`)
  }
  if (lead.extras.length > 0) lines.push(`➕ ${escapeHtml(lead.extras.join(', '))}`)
  if (lead.estimate) lines.push(`💰 ${escapeHtml(lead.estimate)}`)
  if (lead.message) lines.push('', escapeHtml(lead.message))
  lines.push('', `🌐 ${lead.locale.toUpperCase()}`)

  return lines.join('\n')
}

export type BookingNotice = {
  visitAt: Date
  name: string
  phone: string
  address: string
  renovationType?: RenovationType
  area?: number
  notes?: string
  source: 'web' | 'telegram'
  locale: string
}

const visitTime = new Intl.DateTimeFormat('uk-UA', {
  timeZone: 'Europe/Kyiv',
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
})

const sourceLabels = { web: 'чат на сайті', telegram: 'Telegram' }

export function formatBookingMessage(booking: BookingNotice) {
  const lines = [
    '<b>Новий запис на виїзд</b>',
    `🗓 ${visitTime.format(booking.visitAt)}`,
    `👤 ${escapeHtml(booking.name)}`,
    `📞 ${escapeHtml(booking.phone)}`,
    `📍 ${escapeHtml(booking.address)}`,
  ]

  if (booking.area || booking.renovationType) {
    const parts = [
      booking.area ? `${booking.area} м²` : null,
      booking.renovationType ? typeLabels[booking.renovationType] : null,
    ].filter(Boolean)
    lines.push(`📐 ${parts.join(', ')}`)
  }
  if (booking.notes) lines.push('', escapeHtml(booking.notes))
  lines.push('', `💬 ${sourceLabels[booking.source]} · ${booking.locale.toUpperCase()}`)

  return lines.join('\n')
}

export async function callTelegram(token: string, method: string, body: Record<string, unknown>) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error(`Telegram ${method} responded with ${response.status}`)
  return response.json() as Promise<{ ok: boolean; result?: unknown; description?: string }>
}

export async function sendToTelegram(
  text: string,
  { token, chatId }: { token?: string; chatId?: string },
) {
  if (!token || !chatId) return false
  await callTelegram(token, 'sendMessage', { chat_id: chatId, text, parse_mode: 'HTML' })
  return true
}
