import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Testimonial } from '@/payload-types'

function Card({ testimonial }: { testimonial: Testimonial }) {
  const t = useTranslations('testimonials')
  const project = typeof testimonial.project === 'object' ? testimonial.project : null

  return (
    <figure className="flex w-[min(24rem,82vw)] shrink-0 flex-col rounded-card bg-white p-7 shadow-card">
      <div
        className="flex gap-1 text-accent-500"
        role="img"
        aria-label={t('rating', { rating: testimonial.rating })}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className="size-4"
            fill={index < testimonial.rating ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        ))}
      </div>
      <blockquote className="mt-5 flex-1 leading-relaxed">{testimonial.text}</blockquote>
      <figcaption className="mt-6 border-t border-ink/10 pt-4">
        <p className="font-semibold">{testimonial.author}</p>
        {project && <p className="text-sm text-muted">{project.title}</p>}
      </figcaption>
    </figure>
  )
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const t = useTranslations('testimonials')

  return (
    <section className="overflow-hidden py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
      </Container>

      <div className="marquee mt-14" role="region" aria-label={t('title')} tabIndex={0}>
        <div className="marquee-track flex w-max gap-6 px-3">
          <ul className="flex gap-6">
            {testimonials.map((testimonial) => (
              <li key={testimonial.id} className="flex">
                <Card testimonial={testimonial} />
              </li>
            ))}
          </ul>
          <ul className="marquee-copy flex gap-6" aria-hidden="true" inert>
            {testimonials.map((testimonial) => (
              <li key={testimonial.id} className="flex">
                <Card testimonial={testimonial} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
