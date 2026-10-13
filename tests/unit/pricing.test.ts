import { describe, expect, it } from 'vitest'

import { estimatePrice, type Rates } from '@/lib/pricing'

const rates: Rates = {
  types: [
    { key: 'cosmetic', pricePerSqm: 4500 },
    { key: 'capital', pricePerSqm: 9800 },
  ],
  extras: [
    { key: 'design', price: 900, perSqm: true },
    { key: 'cleanup', price: 6500, perSqm: false },
  ],
}

describe('estimatePrice', () => {
  it('multiplies the area by the rate of the chosen type', () => {
    const result = estimatePrice({ area: 50, type: 'cosmetic', extras: [] }, rates)
    expect(result.total).toBe(225000)
  })

  it('adds per-square-metre and fixed extras', () => {
    const result = estimatePrice(
      { area: 50, type: 'capital', extras: ['design', 'cleanup'] },
      rates,
    )
    expect(result.total).toBe(50 * 9800 + 50 * 900 + 6500)
  })

  it('returns a rounded range around the total', () => {
    const result = estimatePrice({ area: 68, type: 'capital', extras: [] }, rates)
    expect(result.min).toBe(600000)
    expect(result.max).toBe(766000)
    expect(result.min % 1000).toBe(0)
    expect(result.max % 1000).toBe(0)
  })

  it('ignores unknown extras and types', () => {
    const result = estimatePrice({ area: 10, type: 'designer', extras: ['missing'] }, rates)
    expect(result.total).toBe(0)
  })
})
