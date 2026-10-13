import { useTranslations } from 'next-intl'

import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Pricing } from '@/payload-types'

import { Calculator } from './Calculator'

export function PricingSection({ pricing }: { pricing: Pricing }) {
  const t = useTranslations('calculator')

  return (
    <section id="pricing" className="bg-sand-100 py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <Calculator
          rates={{
            types: pricing.types.map(({ key, pricePerSqm, description }) => ({
              key,
              pricePerSqm,
              description,
            })),
            extras: (pricing.extras ?? []).map(({ key, label, price, perSqm }) => ({
              key,
              label,
              price,
              perSqm: Boolean(perSqm),
            })),
          }}
        />
      </Container>
    </section>
  )
}
