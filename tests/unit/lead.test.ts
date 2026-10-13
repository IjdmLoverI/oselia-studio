import { describe, expect, it } from 'vitest'

import { leadFieldErrors, leadSchema, normalizePhone } from '@/lib/lead'
import { formatLeadMessage } from '@/lib/telegram'

describe('normalizePhone', () => {
  it.each([
    ['067 123 45 67', '+380671234567'],
    ['+38 (067) 123-45-67', '+380671234567'],
    ['380671234567', '+380671234567'],
    ['+48 512 345 678', '+48512345678'],
  ])('normalizes %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })

  it.each(['12345', 'phone', '067 123'])('rejects %s', (input) => {
    expect(normalizePhone(input)).toBeNull()
  })
})

const valid = {
  name: 'Олена',
  phone: '067 123 45 67',
  consent: 'on',
  extras: [],
  locale: 'uk',
}

describe('leadSchema', () => {
  it('accepts a minimal lead and normalizes the phone', () => {
    const result = leadSchema.parse(valid)
    expect(result.phone).toBe('+380671234567')
    expect(result.message).toBeUndefined()
  })

  it('reports the fields that need attention', () => {
    const result = leadSchema.safeParse({ ...valid, name: 'О', phone: '123', consent: undefined })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(leadFieldErrors(result.error)).toEqual({ name: true, phone: true, consent: true })
    }
  })

  it('turns an empty area into undefined', () => {
    expect(leadSchema.parse({ ...valid, area: '' }).area).toBeUndefined()
    expect(leadSchema.parse({ ...valid, area: '68' }).area).toBe(68)
  })
})

describe('formatLeadMessage', () => {
  it('escapes HTML that a visitor typed', () => {
    const lead = leadSchema.parse({ ...valid, name: '<b>Ivan</b> & Co', message: 'a < b' })
    const text = formatLeadMessage(lead)
    expect(text).toContain('&lt;b&gt;Ivan&lt;/b&gt; &amp; Co')
    expect(text).toContain('a &lt; b')
    expect(text).not.toContain('<b>Ivan')
  })

  it('includes the estimate details when present', () => {
    const lead = leadSchema.parse({
      ...valid,
      area: '68',
      renovationType: 'capital',
      extras: ['design'],
      estimate: '600 000 – 766 000 грн',
    })
    const text = formatLeadMessage(lead)
    expect(text).toContain('68 м², капітальний')
    expect(text).toContain('600 000 – 766 000 грн')
  })
})
