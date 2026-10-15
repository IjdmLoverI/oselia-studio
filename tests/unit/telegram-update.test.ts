import { describe, expect, it } from 'vitest'

import { readUpdate, telegramLocale } from '@/lib/assistant/telegram-update'

const update = (message: Record<string, unknown>) => ({
  update_id: 1,
  message: {
    message_id: 10,
    chat: { id: 42, type: 'private' },
    from: { id: 7, is_bot: false, language_code: 'uk' },
    ...message,
  },
})

describe('readUpdate', () => {
  it('reads a text message from a private chat', () => {
    expect(readUpdate(update({ text: 'Скільки коштує ремонт?' }))).toEqual({
      kind: 'text',
      chatId: '42',
      locale: 'uk',
      text: 'Скільки коштує ремонт?',
    })
  })

  it('treats /start and /help as a greeting request', () => {
    expect(readUpdate(update({ text: '/start' }))).toMatchObject({ kind: 'start' })
    expect(readUpdate(update({ text: '/help' }))).toMatchObject({ kind: 'start' })
  })

  it('answers stickers, photos and voice with a text-only note', () => {
    expect(readUpdate(update({ sticker: {} }))).toMatchObject({ kind: 'unsupported', chatId: '42' })
  })

  it('ignores groups, bots and updates without a message', () => {
    expect(readUpdate(update({ text: 'hi', chat: { id: -100, type: 'group' } }))).toEqual({
      kind: 'ignore',
    })
    expect(
      readUpdate(update({ text: 'hi', from: { id: 8, is_bot: true, language_code: 'en' } })),
    ).toEqual({ kind: 'ignore' })
    expect(readUpdate({ update_id: 2, edited_message: {} })).toEqual({ kind: 'ignore' })
    expect(readUpdate(null)).toEqual({ kind: 'ignore' })
  })
})

describe('telegramLocale', () => {
  it('answers Ukrainian, Russian and unknown language users in Ukrainian', () => {
    expect(telegramLocale('uk')).toBe('uk')
    expect(telegramLocale('ru')).toBe('uk')
    expect(telegramLocale(undefined)).toBe('uk')
  })

  it('answers everyone else in English', () => {
    expect(telegramLocale('en')).toBe('en')
    expect(telegramLocale('de')).toBe('en')
  })
})
