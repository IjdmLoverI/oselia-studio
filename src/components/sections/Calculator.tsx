'use client'

import { Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useId, useState } from 'react'

import { AnimatedNumber } from '@/components/motion/AnimatedNumber'
import { buttonStyles } from '@/components/ui/Button'
import { saveEstimate } from '@/lib/estimate-store'
import { estimatePrice, type RenovationType } from '@/lib/pricing'
import { cn } from '@/lib/utils'

export type CalculatorRates = {
  types: { key: RenovationType; pricePerSqm: number; description: string }[]
  extras: { key: string; label: string; price: number; perSqm: boolean }[]
}

const MIN_AREA = 10
const MAX_AREA = 300

export function Calculator({ rates }: { rates: CalculatorRates }) {
  const t = useTranslations('calculator')
  const id = useId()
  const [area, setArea] = useState(68)
  const [type, setType] = useState<RenovationType>(rates.types[1]?.key ?? rates.types[0].key)
  const [extras, setExtras] = useState<string[]>([])

  const estimate = estimatePrice({ area, type, extras }, rates)
  const clampArea = (value: number) => Math.min(MAX_AREA, Math.max(MIN_AREA, value))

  const toggleExtra = (key: string) =>
    setExtras((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    )

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-8">
      <div className="space-y-10 rounded-card bg-white p-6 shadow-card sm:p-8">
        <fieldset>
          <legend className="text-sm font-semibold tracking-wide text-muted uppercase">
            {t('area')}
          </legend>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setArea((value) => clampArea(value - 5))}
              aria-label={t('decrease')}
              className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 transition-colors hover:border-ink/40"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <output
              htmlFor={`${id}-area`}
              className="min-w-32 text-center font-display text-4xl font-semibold tabular-nums"
            >
              {t('areaValue', { area })}
            </output>
            <button
              type="button"
              onClick={() => setArea((value) => clampArea(value + 5))}
              aria-label={t('increase')}
              className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 transition-colors hover:border-ink/40"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
          <input
            id={`${id}-area`}
            type="range"
            min={MIN_AREA}
            max={MAX_AREA}
            value={area}
            onChange={(event) => setArea(Number(event.target.value))}
            aria-label={t('area')}
            aria-valuetext={t('areaValue', { area })}
            className="mt-5 h-2 w-full cursor-pointer accent-accent-600"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>{t('areaValue', { area: MIN_AREA })}</span>
            <span>{t('areaValue', { area: MAX_AREA })}</span>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold tracking-wide text-muted uppercase">
            {t('type')}
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {rates.types.map((rate) => (
              <label
                key={rate.key}
                className={cn(
                  'relative flex cursor-pointer flex-col rounded-2xl border-2 p-4 transition-colors',
                  type === rate.key
                    ? 'border-accent-500 bg-accent-500/5'
                    : 'border-ink/10 hover:border-ink/25',
                )}
              >
                <input
                  type="radio"
                  name={`${id}-type`}
                  value={rate.key}
                  checked={type === rate.key}
                  onChange={() => setType(rate.key)}
                  className="sr-only"
                />
                <span className="font-semibold">{t(`types.${rate.key}`)}</span>
                <span className="mt-1 text-sm font-semibold text-accent-700">
                  {t('perSqm', { price: rate.pricePerSqm })}
                </span>
                <span className="mt-2 text-sm leading-snug text-muted">{rate.description}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {rates.extras.length > 0 && (
          <fieldset>
            <legend className="text-sm font-semibold tracking-wide text-muted uppercase">
              {t('extras')}
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {rates.extras.map((extra) => {
                const active = extras.includes(extra.key)
                return (
                  <label
                    key={extra.key}
                    className={cn(
                      'cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors',
                      active
                        ? 'border-ink bg-ink text-sand-50'
                        : 'border-ink/15 hover:border-ink/40',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleExtra(extra.key)}
                      className="sr-only"
                    />
                    <span className="font-semibold">{extra.label}</span>{' '}
                    <span className={active ? 'text-sand-200' : 'text-muted'}>
                      {extra.perSqm
                        ? t('extraPerSqm', { price: extra.price })
                        : t('extraFixed', { price: extra.price })}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        )}
      </div>

      <div className="self-start rounded-card bg-ink p-6 text-sand-50 shadow-card sm:p-8 lg:sticky lg:top-28">
        <p className="text-sm font-semibold tracking-wide text-sand-300 uppercase">{t('result')}</p>
        <p
          aria-hidden="true"
          className="mt-6 font-display text-3xl leading-tight font-semibold sm:text-4xl"
        >
          <span className="block text-base font-medium text-sand-300">{t('from')}</span>
          <AnimatedNumber value={estimate.min} />
          <span className="mt-2 block text-base font-medium text-sand-300">{t('to')}</span>
          <AnimatedNumber value={estimate.max} /> {t('currency')}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-sand-300">{t('note')}</p>
        <a
          href="#contact"
          onClick={() => saveEstimate({ area, type, extras, min: estimate.min, max: estimate.max })}
          className={cn(buttonStyles({ size: 'lg' }), 'mt-8 w-full')}
        >
          {t('cta')}
        </a>
        <p className="sr-only" aria-live="polite">
          {t('range', { min: estimate.min, max: estimate.max })}
        </p>
      </div>
    </div>
  )
}
