import { tool } from 'ai'
import { z } from 'zod'

import { renovationTypes } from '@/collections/Leads'
import { normalizePhone } from '@/lib/lead'
import { estimatePrice, type Rates, type RenovationType } from '@/lib/pricing'

import type { Locale } from '@/i18n/routing'

import {
  fromStudioTime,
  groupSlots,
  isSlotOpen,
  labelDay,
  listSlots,
  normalizeSlot,
  STUDIO_TIME_ZONE,
  type Schedule,
} from './slots'

export type BookingRequest = {
  slot: string
  visitAt: Date
  name: string
  phone: string
  address: string
  renovationType?: RenovationType
  area?: number
  notes?: string
}

export type PendingBooking = Omit<BookingRequest, 'visitAt'> & { turn: string }

export type ToolDeps = {
  locale: Locale
  turn: string
  now: () => Date
  rates: Rates
  schedule: Schedule
  takenVisits: () => Promise<Date[]>
  existingBooking: () => Promise<string | null>
  pendingBooking: () => Promise<PendingBooking | null>
  savePending: (pending: PendingBooking | null) => Promise<void>
  createBooking: (request: BookingRequest) => Promise<'created' | 'taken'>
  log?: (message: string) => void
}

const NEAREST_DAYS = 3

const sameVisit = (a: Omit<PendingBooking, 'turn'>, b: Omit<PendingBooking, 'turn'>) =>
  a.slot === b.slot && a.name === b.name && a.phone === b.phone && a.address === b.address

const renovationNames: Record<Locale, Record<RenovationType, string>> = {
  uk: { cosmetic: 'косметичний', capital: 'капітальний', designer: 'дизайнерський' },
  en: { cosmetic: 'cosmetic', capital: 'full', designer: 'designer' },
}

const areaUnit: Record<Locale, string> = { uk: 'м²', en: 'm²' }

const labourOnly: Record<Locale, string> = {
  uk: 'лише робота, матеріали окремо',
  en: 'labour only, materials extra',
}

export const describeSlot = (slot: string, locale: Locale) =>
  `${labelDay(slot.slice(0, 10), locale)}, ${slot.slice(11)}`

const estimateInput = z.object({
  area: z.number().positive().max(5000).describe('Area in square metres'),
  type: z.enum(renovationTypes),
  extras: z.array(z.string()).max(10).nullish().describe('Keys from the extras list'),
})

const slotsInput = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullish()
    .describe('Day to check, YYYY-MM-DD'),
})

const bookingInput = z.object({
  slot: z.string().describe('A time returned by find_slots, YYYY-MM-DDTHH:mm'),
  name: z.string(),
  phone: z.string(),
  address: z.string().describe('Address or district'),
  renovationType: z.enum(renovationTypes).nullish(),
  area: z.number().positive().max(5000).nullish(),
  notes: z.string().max(500).nullish(),
})

export function createActions(deps: ToolDeps) {
  return {
    estimate({ area, type, extras }: z.infer<typeof estimateInput>) {
      extras ??= []
      const known = new Set(deps.rates.extras.map((extra) => extra.key))
      const { min, max } = estimatePrice({ area, type, extras }, deps.rates)
      return {
        renovation: renovationNames[deps.locale][type],
        minUAH: min,
        maxUAH: max,
        covers: labourOnly[deps.locale],
        unknownExtras: extras.filter((key) => !known.has(key)),
      }
    },

    async findSlots({ date }: z.infer<typeof slotsInput>) {
      const slots = listSlots(deps.schedule, { now: deps.now(), taken: await deps.takenVisits() })
      const days = groupSlots(slots).map((day) => ({
        ...day,
        label: labelDay(day.date, deps.locale),
      }))
      if (!date) return { timeZone: STUDIO_TIME_ZONE, days: days.slice(0, NEAREST_DAYS) }

      const day = days.find((candidate) => candidate.date === date)
      return day
        ? { timeZone: STUDIO_TIME_ZONE, days: [day] }
        : {
            timeZone: STUDIO_TIME_ZONE,
            requestedDateIsFull: true,
            days: days.slice(0, NEAREST_DAYS),
          }
    },

    async book(input: z.infer<typeof bookingInput>) {
      const refuse = (error: string, details: Record<string, string> = {}) => {
        deps.log?.(`book_visit refused: ${error}`)
        return { ok: false, error, ...details }
      }

      const name = input.name.trim()
      const address = input.address.trim()
      if (name.length < 2 || name.length > 80) return refuse('invalid_name')
      if (address.length < 2 || address.length > 200) return refuse('invalid_address')

      const phone = normalizePhone(input.phone)
      if (!phone) return refuse('invalid_phone')

      const existing = await deps.existingBooking()
      if (existing) {
        return refuse('already_booked', { visit: describeSlot(existing, deps.locale) })
      }

      const slot = normalizeSlot(input.slot)
      const visitAt = fromStudioTime(slot)
      if (!visitAt) return refuse('invalid_slot_format', { expected: 'YYYY-MM-DDTHH:mm' })
      const open = isSlotOpen(deps.schedule, slot, {
        now: deps.now(),
        taken: await deps.takenVisits(),
      })
      if (!open) return refuse('slot_unavailable')

      const request = {
        slot,
        name,
        phone,
        address,
        renovationType: input.renovationType ?? undefined,
        area: input.area ?? undefined,
        notes: input.notes?.trim() || undefined,
      }
      const visit = {
        when: describeSlot(slot, deps.locale),
        name,
        phone,
        address,
        ...(input.renovationType && {
          renovation: renovationNames[deps.locale][input.renovationType],
        }),
        ...(input.area && { area: `${input.area} ${areaUnit[deps.locale]}` }),
      }

      const pending = await deps.pendingBooking()
      if (!pending || pending.turn === deps.turn || !sameVisit(pending, request)) {
        await deps.savePending({ ...request, turn: deps.turn })
        return {
          ok: false,
          status: 'needs_confirmation',
          visit,
          next: 'Read these details back and ask the visitor to confirm. Call book_visit again with the same details only after they agree.',
        }
      }

      const result = await deps.createBooking({ ...request, visitAt })
      await deps.savePending(null)
      return result === 'created' ? { ok: true, visit } : refuse('slot_taken_meanwhile')
    },
  }
}

export function createTools(deps: ToolDeps) {
  const actions = createActions(deps)

  return {
    estimate_price: tool({
      description:
        'Estimate the labour cost of a renovation in UAH. Returns a range without materials.',
      inputSchema: estimateInput,
      execute: actions.estimate,
    }),
    find_slots: tool({
      description:
        'List free site visit times in Kyiv time. Without a date returns the nearest days with free times.',
      inputSchema: slotsInput,
      execute: actions.findSlots,
    }),
    book_visit: tool({
      description:
        'Book a free site visit. Call only after the visitor confirmed the time and their details.',
      inputSchema: bookingInput,
      execute: actions.book,
    }),
  }
}
