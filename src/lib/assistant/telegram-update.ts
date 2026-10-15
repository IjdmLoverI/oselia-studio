import { z } from 'zod'

import type { Locale } from '@/i18n/routing'

const updateSchema = z.object({
  message: z.object({
    text: z.string().optional(),
    chat: z.object({ id: z.number(), type: z.string() }),
    from: z.object({ is_bot: z.boolean(), language_code: z.string().optional() }).optional(),
  }),
})

export type BotEvent =
  | { kind: 'ignore' }
  | { kind: 'start'; chatId: string; locale: Locale }
  | { kind: 'unsupported'; chatId: string; locale: Locale }
  | { kind: 'text'; chatId: string; locale: Locale; text: string }

export const telegramLocale = (code?: string): Locale =>
  !code || /^(uk|ru|be)\b/.test(code) ? 'uk' : 'en'

export function readUpdate(input: unknown): BotEvent {
  const parsed = updateSchema.safeParse(input)
  if (!parsed.success) return { kind: 'ignore' }

  const { text, chat, from } = parsed.data.message
  if (chat.type !== 'private' || from?.is_bot) return { kind: 'ignore' }

  const base = { chatId: String(chat.id), locale: telegramLocale(from?.language_code) }
  if (text === undefined) return { kind: 'unsupported', ...base }
  if (/^\/(start|help)\b/.test(text)) return { kind: 'start', ...base }
  return { kind: 'text', text, ...base }
}
