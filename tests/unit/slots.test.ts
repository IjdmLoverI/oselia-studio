import { describe, expect, it } from 'vitest'

import {
  fromStudioTime,
  groupSlots,
  isSlotOpen,
  listSlots,
  toStudioTime,
  type Schedule,
} from '@/lib/assistant/slots'

const schedule: Schedule = {
  workDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
  dayStart: 10,
  dayEnd: 18,
  slotMinutes: 120,
  daysAhead: 7,
  minNoticeHours: 0,
}

const thursdayMorning = new Date('2026-10-15T06:00:00Z')

describe('listSlots', () => {
  it('offers every slot of the working days inside the booking window', () => {
    const slots = listSlots(schedule, { now: thursdayMorning, taken: [] })

    expect(slots).toHaveLength(20)
    expect(slots[0]).toBe('2026-10-15T10:00')
    expect(slots.at(-1)).toBe('2026-10-21T16:00')
    expect(slots.some((slot) => slot.startsWith('2026-10-17'))).toBe(false)
    expect(slots.some((slot) => slot.startsWith('2026-10-22'))).toBe(false)
  })

  it('skips slots that start sooner than the minimum notice', () => {
    const slots = listSlots({ ...schedule, minNoticeHours: 4 }, { now: thursdayMorning, taken: [] })
    expect(slots[0]).toBe('2026-10-15T14:00')
  })

  it('removes slots that overlap an existing visit, even one booked off the grid', () => {
    const taken = [new Date('2026-10-16T09:00:00Z'), new Date('2026-10-19T08:00:00Z')]
    const slots = listSlots(schedule, { now: thursdayMorning, taken })

    expect(slots).not.toContain('2026-10-16T12:00')
    expect(slots).toContain('2026-10-16T10:00')
    expect(slots).not.toContain('2026-10-19T10:00')
    expect(slots).not.toContain('2026-10-19T12:00')
    expect(slots).toContain('2026-10-19T14:00')
  })

  it('counts days by the Kyiv calendar, not by UTC', () => {
    const slots = listSlots(schedule, { now: new Date('2026-10-15T22:30:00Z'), taken: [] })
    expect(slots[0]).toBe('2026-10-16T10:00')
  })

  it('stays within the booking window', () => {
    const slots = listSlots({ ...schedule, daysAhead: 1 }, { now: thursdayMorning, taken: [] })
    expect(slots).toEqual([
      '2026-10-15T10:00',
      '2026-10-15T12:00',
      '2026-10-15T14:00',
      '2026-10-15T16:00',
    ])
  })
})

describe('isSlotOpen', () => {
  const context = { now: thursdayMorning, taken: [] }

  it('accepts a listed slot', () => {
    expect(isSlotOpen(schedule, '2026-10-16T12:00', context)).toBe(true)
  })

  it('rejects times off the grid, on days off and in the past', () => {
    expect(isSlotOpen(schedule, '2026-10-16T11:00', context)).toBe(false)
    expect(isSlotOpen(schedule, '2026-10-17T10:00', context)).toBe(false)
    expect(isSlotOpen(schedule, '2026-10-14T10:00', context)).toBe(false)
  })
})

describe('studio time', () => {
  it('converts Kyiv wall time across the switch to winter time', () => {
    expect(fromStudioTime('2026-10-23T10:00')?.toISOString()).toBe('2026-10-23T07:00:00.000Z')
    expect(fromStudioTime('2026-10-26T10:00')?.toISOString()).toBe('2026-10-26T08:00:00.000Z')
    expect(toStudioTime(new Date('2026-10-26T08:00:00Z'))).toBe('2026-10-26T10:00')
  })

  it('rejects malformed and non-existent times', () => {
    expect(fromStudioTime('2026-10-16 10:00')).toBeNull()
    expect(fromStudioTime('2026-13-01T10:00')).toBeNull()
    expect(fromStudioTime('2026-03-29T03:30')).toBeNull()
  })
})

describe('groupSlots', () => {
  it('groups slots by day and names the weekday', () => {
    expect(groupSlots(['2026-10-16T10:00', '2026-10-16T12:00', '2026-10-19T10:00'])).toEqual([
      { date: '2026-10-16', weekday: 'fri', times: ['10:00', '12:00'] },
      { date: '2026-10-19', weekday: 'mon', times: ['10:00'] },
    ])
  })
})
