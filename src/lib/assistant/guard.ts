export const MAX_MESSAGE_LENGTH = 600
export const HISTORY_LIMIT = 20
export const CLIENT_WINDOW_MS = 10 * 60 * 1000

export type Limits = { perClient: number; perDay: number }

export type StoredMessage = { role: 'user' | 'assistant'; text: string; at: string }

export function readMessage(input: unknown) {
  if (typeof input !== 'string') return { ok: false as const, reason: 'empty' as const }
  const text = input.replace(/\s+/g, ' ').trim()
  if (!text) return { ok: false as const, reason: 'empty' as const }
  if (text.length > MAX_MESSAGE_LENGTH) return { ok: false as const, reason: 'tooLong' as const }
  return { ok: true as const, text }
}

export function countUserMessages(
  conversations: { messages?: StoredMessage[] | null }[],
  since: Date,
) {
  const from = since.getTime()
  return conversations.reduce(
    (sum, conversation) =>
      sum +
      (conversation.messages ?? []).filter(
        (message) => message.role === 'user' && new Date(message.at).getTime() >= from,
      ).length,
    0,
  )
}

export function limitReached(counts: { client: number; site: number }, limits: Limits) {
  if (counts.site >= limits.perDay) return 'site' as const
  if (counts.client >= limits.perClient) return 'client' as const
  return null
}

export function recentHistory(messages: StoredMessage[]) {
  return messages
    .slice(-HISTORY_LIMIT)
    .map((message) => ({ role: message.role, content: message.text }))
}
