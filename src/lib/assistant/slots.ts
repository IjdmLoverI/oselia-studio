import type { Locale } from '@/i18n/routing'

export const STUDIO_TIME_ZONE = 'Europe/Kyiv'

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type Schedule = {
  workDays: Weekday[]
  dayStart: number
  dayEnd: number
  slotMinutes: number
  daysAhead: number
  minNoticeHours: number
}

export type SlotDay = { date: string; weekday: Weekday; times: string[] }

const weekdayByIndex: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const LOCAL_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
const MINUTE = 60_000

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: STUDIO_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

const pad = (value: number) => String(value).padStart(2, '0')

function wallClock(instant: number) {
  const parts = Object.fromEntries(
    formatter.formatToParts(instant).map((part) => [part.type, Number(part.value)]),
  )
  return {
    year: parts.year!,
    month: parts.month!,
    day: parts.day!,
    hour: parts.hour!,
    minute: parts.minute!,
  }
}

export function toStudioTime(date: Date) {
  const { year, month, day, hour, minute } = wallClock(date.getTime())
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`
}

export function fromStudioTime(local: string) {
  const match = LOCAL_TIME.exec(local)
  if (!match) return null
  const [year, month, day, hour, minute] = match.slice(1).map(Number) as [
    number,
    number,
    number,
    number,
    number,
  ]
  const asUtc = Date.UTC(year, month - 1, day, hour, minute)

  for (const guess of [asUtc - 3 * 60 * MINUTE, asUtc - 2 * 60 * MINUTE, asUtc]) {
    const clock = wallClock(guess)
    const offset =
      Date.UTC(clock.year, clock.month - 1, clock.day, clock.hour, clock.minute) - guess
    const candidate = new Date(asUtc - offset)
    if (toStudioTime(candidate) === local) return candidate
  }
  return null
}

function calendarDay(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day))
  return {
    key: `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`,
    weekday: weekdayByIndex[date.getUTCDay()]!,
  }
}

export function listSlots(schedule: Schedule, { now, taken }: { now: Date; taken: Date[] }) {
  const today = wallClock(now.getTime())
  const earliest = now.getTime() + schedule.minNoticeHours * 60 * MINUTE
  const length = schedule.slotMinutes * MINUTE
  const slots: string[] = []

  for (let offset = 0; offset < schedule.daysAhead; offset += 1) {
    const { key, weekday } = calendarDay(today.year, today.month, today.day + offset)
    if (!schedule.workDays.includes(weekday)) continue

    for (
      let minute = schedule.dayStart * 60;
      minute + schedule.slotMinutes <= schedule.dayEnd * 60;
      minute += schedule.slotMinutes
    ) {
      const local = `${key}T${pad(Math.floor(minute / 60))}:${pad(minute % 60)}`
      const start = fromStudioTime(local)
      if (!start || start.getTime() < earliest) continue
      const overlaps = taken.some((visit) => Math.abs(visit.getTime() - start.getTime()) < length)
      if (!overlaps) slots.push(local)
    }
  }

  return slots
}

export function isSlotOpen(
  schedule: Schedule,
  local: string,
  context: { now: Date; taken: Date[] },
) {
  return listSlots(schedule, context).includes(local)
}

export function groupSlots(slots: string[]) {
  const days: SlotDay[] = []
  for (const slot of slots) {
    const [date, time] = slot.split('T') as [string, string]
    const last = days.at(-1)
    if (last?.date === date) last.times.push(time)
    else {
      const [year, month, day] = date.split('-').map(Number) as [number, number, number]
      days.push({ date, weekday: calendarDay(year, month, day).weekday, times: [time] })
    }
  }
  return days
}

const dayFormats: Record<Locale, Intl.DateTimeFormat> = {
  uk: new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'UTC',
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }),
  en: new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }),
}

export function labelDay(date: string, locale: Locale) {
  const [year, month, day] = date.split('-').map(Number) as [number, number, number]
  return dayFormats[locale].format(Date.UTC(year, month - 1, day))
}

export function normalizeSlot(input: string) {
  const match = /^(\d{4}-\d{2}-\d{2})[T ](\d{1,2}):(\d{2})/.exec(input.trim())
  return match ? `${match[1]}T${match[2]!.padStart(2, '0')}:${match[3]}` : input.trim()
}
