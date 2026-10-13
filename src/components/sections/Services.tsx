import { useTranslations } from 'next-intl'
import type { CSSProperties } from 'react'

import { InView } from '@/components/motion/InView'
import { CmsImage } from '@/components/ui/CmsImage'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { asMedia } from '@/lib/media'
import type { Service } from '@/payload-types'

export function Services({ services }: { services: Service[] }) {
  const t = useTranslations('services')

  return (
    <section id="services" className="py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

        <InView amount={0.1} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const image = asMedia(service.image)
            return (
              <article
                key={service.id}
                className="reveal-fade group flex flex-col overflow-hidden rounded-card bg-white shadow-card"
                style={{ '--d': `${(index % 3) * 90}ms` } as CSSProperties}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {image && (
                    <CmsImage
                      media={image}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-semibold">{service.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{service.summary}</p>
                  {service.priceFrom ? (
                    <p className="mt-5 text-sm font-semibold text-accent-700">
                      {t('priceFrom', { price: service.priceFrom })}
                    </p>
                  ) : null}
                </div>
              </article>
            )
          })}
        </InView>
      </Container>
    </section>
  )
}
