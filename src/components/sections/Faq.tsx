import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { CSSProperties } from 'react'

import { SectionLink } from '@/components/layout/SectionLink'
import { InView } from '@/components/motion/InView'
import { buttonStyles } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Faq as FaqItem } from '@/payload-types'

export function Faq({ faqs }: { faqs: FaqItem[] }) {
  const t = useTranslations('faq')

  return (
    <section id="faq" className="bg-sand-100 py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
          <SectionLink section="contact" className={`${buttonStyles({ variant: 'dark' })} mt-8`}>
            {t('cta')}
          </SectionLink>
        </div>

        <InView amount={0.1} className="divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((faq, index) => (
            <details
              key={faq.id}
              name="faq"
              className="faq-item reveal-fade group"
              style={{ '--d': `${index * 60}ms` } as CSSProperties}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/15 transition-transform duration-300 group-open:rotate-45">
                  <Plus className="size-4" aria-hidden="true" />
                </span>
              </summary>
              <p className="pr-14 pb-6 leading-relaxed text-muted">{faq.answer}</p>
            </details>
          ))}
        </InView>
      </Container>
    </section>
  )
}
