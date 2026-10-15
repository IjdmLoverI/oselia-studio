import { tool } from 'ai'
import { z } from 'zod'

import { renovationTypes } from '@/collections/Leads'
import { normalizePhone } from '@/lib/lead'
import { estimatePrice, type Rates, type RenovationType } from '@/lib/pricing'

import {
  fromStudioTime,
  groupSlots,
  isSlotOpen,
  listSlots,
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

export type ToolDeps = {
  now: () => Date
  rates: Rates
  schedule: Schedule
  takenVisits: () => Promise<Date[]>
  existingBooking: () => Promise<string | null>
  createBooking: (request: BookingRequest) => Promise<'created' | 'taken'>
}

const NEAREST_DAYS = 3

const estimateInput = z.object({
  area: z.number().positive().max(5000).describe('Area in square metres'),
  type: z.enum(renovationTypes),
  extras: z.array(z.string()).max(10).optional().describe('Keys from the extras list'),
})

const slotsInput = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .describe('Day to check, YYYY-MM-DD'),
})

const bookingInput = z.object({
  slot: z.string().describe('A time returned by find_slots, YYYY-MM-DDTHH:mm'),
  name: z.string(),
  phone: z.string(),
  address: z.string().describe('Address or district'),
  renovationType: z.enum(renovationTypes).optional(),
  area: z.number().positive().max(5000).optional(),
  notes: z.string().max(500).optional(),
})

export function createActions(deps: ToolDeps) {
  return {
    estimate({ area, type, extras = [] }: z.infer<typeof estimateInput>) {
      const known = new Set(deps.rates.extras.map((extra) => extra.key))
      const { min, max } = estimatePrice({ area, type, extras }, deps.rates)
      return {
        minUAH: min,
        maxUAH: max,
        labourOnly: true,
        unknownExtras: extras.filter((key) => !known.has(key)),
      }
    },

    async findSlots({ date }: z.infer<typeof slotsInput>) {
      const slots = listSlots(deps.schedule, { now: deps.now(), taken: await deps.takenVisits() })
      const days = groupSlots(slots)
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
      const name = input.name.trim()
      const address = input.address.trim()
      if (name.length < 2 || name.length > 80) return { ok: false, error: 'invalid_name' }
      if (address.length < 2 || address.length > 200) return { ok: false, error: 'invalid_address' }

      const phone = normalizePhone(input.phone)
      if (!phone) return { ok: false, error: 'invalid_phone' }

      const existing = await deps.existingBooking()
      if (existing) return { ok: false, error: 'already_booked', slot: existing }

      const visitAt = fromStudioTime(input.slot)
      const open =
        visitAt &&
        isSlotOpen(deps.schedule, input.slot, { now: deps.now(), taken: await deps.takenVisits() })
      if (!visitAt || !open) return { ok: false, error: 'slot_unavailable' }

      const result = await deps.createBooking({
        slot: input.slot,
        visitAt,
        name,
        phone,
        address,
        renovationType: input.renovationType,
        area: input.area,
        notes: input.notes?.trim() || undefined,
      })
      return result === 'created'
        ? { ok: true, slot: input.slot }
        : { ok: false, error: 'slot_unavailable' }
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
