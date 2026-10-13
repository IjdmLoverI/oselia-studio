export type RenovationType = 'cosmetic' | 'capital' | 'designer'

export type Rates = {
  types: { key: RenovationType; pricePerSqm: number }[]
  extras: { key: string; price: number; perSqm?: boolean | null }[]
}

export type EstimateInput = {
  area: number
  type: RenovationType
  extras: string[]
}

const roundToThousand = (value: number) => Math.round(value / 1000) * 1000

export function estimatePrice({ area, type, extras }: EstimateInput, rates: Rates) {
  const base = rates.types.find((rate) => rate.key === type)?.pricePerSqm ?? 0
  const extrasTotal = rates.extras
    .filter((extra) => extras.includes(extra.key))
    .reduce((sum, extra) => sum + (extra.perSqm ? extra.price * area : extra.price), 0)
  const total = base * area + extrasTotal

  return {
    total,
    min: roundToThousand(total * 0.9),
    max: roundToThousand(total * 1.15),
  }
}
