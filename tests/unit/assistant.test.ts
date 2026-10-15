import { describe, expect, it } from 'vitest'

import {
  countUserMessages,
  limitReached,
  MAX_MESSAGE_LENGTH,
  readMessage,
  recentHistory,
  type StoredMessage,
} from '@/lib/assistant/guard'
import { buildInstructions, type Knowledge } from '@/lib/assistant/prompt'
import { cannedReply } from '@/lib/assistant/replies'
import type { Schedule } from '@/lib/assistant/slots'
import {
  createActions,
  type BookingRequest,
  type PendingBooking,
  type ToolDeps,
} from '@/lib/assistant/tools'
import { formatBookingMessage } from '@/lib/telegram'

const knowledge: Knowledge = {
  site: {
    phone: '+380 00 000 0000',
    email: 'hello@example.com',
    address: '1 Fictional St, Kyiv',
    hours: 'Mon–Fri 9:00–19:00',
    stats: { years: 12, projects: 240, warranty: 3 },
  },
  visitInfo: 'The visit is free.',
  services: [{ title: 'Apartments', summary: 'Turnkey renovation.', priceFrom: 4500 }],
  rates: [{ key: 'cosmetic', pricePerSqm: 4500, description: 'Paint and flooring' }],
  extras: [{ key: 'design', label: 'Interior design', price: 900, perSqm: true }],
  projects: [{ title: 'Pechersk flat', category: 'apartment', area: 64, year: 2025 }],
  faqs: [{ question: 'Do you work outside Kyiv?', answer: 'Yes, within 40 km.' }],
}

const now = new Date('2026-10-15T06:00:00Z')

describe('buildInstructions', () => {
  it('is deterministic for the same content and time', () => {
    const context = { locale: 'uk' as const, now }
    expect(buildInstructions(knowledge, context)).toBe(buildInstructions(knowledge, context))
  })

  it('includes the facts the assistant may use', () => {
    const text = buildInstructions(knowledge, { locale: 'en', now })
    expect(text).toContain('Thursday, 15 October 2026')
    expect(text).toContain('09:00')
    expect(text).toContain('- cosmetic: 4500, Paint and flooring')
    expect(text).toContain('- design: Interior design, 900 UAH per m²')
    expect(text).toContain('Pechersk flat, apartment, 64 m², 2025')
    expect(text).toContain('Q: Do you work outside Kyiv?')
    expect(text).toContain('Site visit: The visit is free.')
  })

  it('tells the model about a booked or a held visit', () => {
    const text = buildInstructions(knowledge, {
      locale: 'en',
      now,
      state: { booked: 'Fri 16 October, 10:00', pending: 'Mon 19 October, 12:00; Olena' },
    })
    expect(text).toContain('already has a site visit booked: Fri 16 October, 10:00')
    expect(text).toContain('Waiting for the visitor to confirm this visit: Mon 19 October, 12:00')
    expect(buildInstructions(knowledge, { locale: 'en', now })).not.toContain('Waiting for')
  })

  it('sets the default reply language from the site locale', () => {
    expect(buildInstructions(knowledge, { locale: 'uk', now })).toContain('Ukrainian by default')
    expect(buildInstructions(knowledge, { locale: 'en', now })).toContain('English by default')
  })
})

const schedule: Schedule = {
  workDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
  dayStart: 10,
  dayEnd: 18,
  slotMinutes: 120,
  daysAhead: 7,
  minNoticeHours: 2,
}

function setup(overrides: Partial<ToolDeps> = {}) {
  const created: BookingRequest[] = []
  let pending: PendingBooking | null = null
  const actionsFor = (turn: string) =>
    createActions({
      locale: 'uk',
      turn,
      now: () => now,
      rates: {
        types: [{ key: 'cosmetic', pricePerSqm: 4500 }],
        extras: [{ key: 'design', price: 900, perSqm: true }],
      },
      schedule,
      takenVisits: async () => [],
      existingBooking: async () => null,
      pendingBooking: async () => pending,
      savePending: async (next) => {
        pending = next
      },
      createBooking: async (request) => {
        created.push(request)
        return 'created'
      },
      ...overrides,
    })
  return {
    actions: actionsFor('first message'),
    later: actionsFor('next message'),
    created,
    pending: () => pending,
  }
}

const visitor = {
  slot: '2026-10-16T10:00',
  name: 'Olena',
  phone: '067 123 45 67',
  address: 'Obolon',
}

describe('estimate_price', () => {
  it('returns a labour-only range and flags unknown extras', async () => {
    const { actions } = setup()
    const result = await actions.estimate({
      area: 50,
      type: 'cosmetic',
      extras: ['design', 'sauna'],
    })
    expect(result).toEqual({
      renovation: 'косметичний',
      minUAH: 243000,
      maxUAH: 311000,
      labourOnly: true,
      unknownExtras: ['sauna'],
    })
  })
})

describe('find_slots', () => {
  it('returns the nearest three days with free times', async () => {
    const { actions } = setup()
    const result = await actions.findSlots({})
    expect(result.days.map((day) => day.date)).toEqual(['2026-10-15', '2026-10-16', '2026-10-19'])
    expect(result.days[0]).toMatchObject({
      label: 'чт, 15 жовтня',
      times: ['12:00', '14:00', '16:00'],
    })
  })

  it('says when the requested day is full and offers the nearest days', async () => {
    const { actions } = setup()
    const result = await actions.findSlots({ date: '2026-10-17' })
    expect(result).toMatchObject({ requestedDateIsFull: true })
    expect(result.days).toHaveLength(3)
  })
})

describe('book_visit', () => {
  const held = {
    ok: false,
    status: 'needs_confirmation',
    visit: {
      when: 'пт, 16 жовтня, 10:00',
      name: 'Olena',
      phone: '+380671234567',
      address: 'Obolon',
    },
    next: expect.any(String),
  }

  it('holds the visit until the visitor confirms in a later message', async () => {
    const { actions, later, created, pending } = setup()

    expect(await actions.book(visitor)).toEqual(held)
    expect(await actions.book(visitor)).toEqual(held)
    expect(created).toHaveLength(0)

    expect(await later.book(visitor)).toEqual({ ok: true, visit: held.visit })
    expect(created[0]).toMatchObject({
      phone: '+380671234567',
      visitAt: new Date('2026-10-16T07:00:00Z'),
    })
    expect(pending()).toBeNull()
  })

  it('reads back the renovation type and area as words', async () => {
    const { actions } = setup()
    expect(await actions.book({ ...visitor, renovationType: 'capital', area: 60 })).toMatchObject({
      visit: { renovation: 'капітальний', area: '60 м²' },
    })
  })

  it('asks again when the details change before the booking', async () => {
    const { actions, later, created } = setup()
    await actions.book(visitor)

    expect(await later.book({ ...visitor, slot: '2026-10-16T12:00' })).toMatchObject({
      status: 'needs_confirmation',
      visit: { when: 'пт, 16 жовтня, 12:00' },
    })
    expect(created).toHaveLength(0)
  })

  it('accepts a slot written with a space or seconds', async () => {
    const { actions, later, created } = setup()
    expect(await actions.book({ ...visitor, slot: '2026-10-16 10:00:00' })).toEqual(held)
    expect(await later.book(visitor)).toMatchObject({ ok: true })
    expect(created).toHaveLength(1)
  })

  it('explains a slot it cannot read', async () => {
    expect(await setup().actions.book({ ...visitor, slot: 'Friday at ten' })).toEqual({
      ok: false,
      error: 'invalid_slot_format',
      expected: 'YYYY-MM-DDTHH:mm',
    })
  })

  it('refuses a bad phone, a time that is not offered and a second booking', async () => {
    expect(await setup().actions.book({ ...visitor, phone: '12' })).toEqual({
      ok: false,
      error: 'invalid_phone',
    })
    expect(await setup().actions.book({ ...visitor, slot: '2026-10-16T11:00' })).toEqual({
      ok: false,
      error: 'slot_unavailable',
    })
    expect(
      await setup({ existingBooking: async () => '2026-10-19T10:00' }).actions.book(visitor),
    ).toEqual({ ok: false, error: 'already_booked', visit: 'пн, 19 жовтня, 10:00' })
  })

  it('refuses a slot that was taken since it was offered', async () => {
    const { actions, created } = setup({
      takenVisits: async () => [new Date('2026-10-16T07:00:00Z')],
    })
    expect(await actions.book(visitor)).toEqual({ ok: false, error: 'slot_unavailable' })
    expect(created).toHaveLength(0)
  })

  it('reports a slot lost to a parallel booking', async () => {
    const { actions, later } = setup({ createBooking: async () => 'taken' })
    await actions.book(visitor)
    expect(await later.book(visitor)).toEqual({ ok: false, error: 'slot_taken_meanwhile' })
  })
})

describe('guard', () => {
  it('normalises whitespace and rejects empty or long messages', () => {
    expect(readMessage('  Hello \n there ')).toEqual({ ok: true, text: 'Hello there' })
    expect(readMessage('   ')).toEqual({ ok: false, reason: 'empty' })
    expect(readMessage(42)).toEqual({ ok: false, reason: 'empty' })
    expect(readMessage('a'.repeat(MAX_MESSAGE_LENGTH + 1))).toEqual({
      ok: false,
      reason: 'tooLong',
    })
  })

  it('counts only visitor messages inside the window', () => {
    const message = (role: StoredMessage['role'], at: string): StoredMessage => ({
      role,
      text: '…',
      at,
    })
    const conversations = [
      {
        messages: [
          message('user', '2026-10-15T05:00:00Z'),
          message('user', '2026-10-15T05:55:00Z'),
          message('assistant', '2026-10-15T05:55:05Z'),
        ],
      },
      { messages: [message('user', '2026-10-15T05:58:00Z')] },
      { messages: null },
    ]
    expect(countUserMessages(conversations, new Date('2026-10-15T05:50:00Z'))).toBe(2)
  })

  it('stops the whole site before a single visitor', () => {
    const limits = { perClient: 20, perDay: 300 }
    expect(limitReached({ client: 3, site: 120 }, limits)).toBeNull()
    expect(limitReached({ client: 20, site: 120 }, limits)).toBe('client')
    expect(limitReached({ client: 20, site: 300 }, limits)).toBe('site')
  })

  it('sends the model only the latest messages', () => {
    const messages = Array.from({ length: 30 }, (_, index) => ({
      role: index % 2 ? ('assistant' as const) : ('user' as const),
      text: String(index),
      at: now.toISOString(),
    }))
    const history = recentHistory(messages)
    expect(history).toHaveLength(20)
    expect(history[0]).toEqual({ role: 'user', content: '10' })
  })
})

describe('notifications and canned replies', () => {
  it('formats a booking for the studio chat and escapes HTML', () => {
    const text = formatBookingMessage({
      visitAt: new Date('2026-10-16T07:00:00Z'),
      name: '<b>Olena</b>',
      phone: '+380671234567',
      address: 'Obolon',
      area: 64,
      renovationType: 'capital',
      source: 'telegram',
      locale: 'uk',
    })
    expect(text).toContain('16 жовтня о 10:00')
    expect(text).toContain('&lt;b&gt;Olena&lt;/b&gt;')
    expect(text).toContain('64 м², капітальний')
    expect(text).toContain('Telegram · UK')
  })

  it('puts the studio phone into replies that need it', () => {
    expect(cannedReply('unavailable', 'en', '+380 00 000 0000')).toContain(
      'call us: +380 00 000 0000',
    )
  })
})
