import type { LeadInput } from './lead'

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

export async function sendToTelegram(
  text: string,
  { token, chatId }: { token?: string; chatId?: string },
) {
  if (!token || !chatId) return false

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error(`Telegram responded with ${response.status}`)
  return true
}
