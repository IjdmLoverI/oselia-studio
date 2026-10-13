import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { CSSProperties } from 'react'

import { InView } from '@/components/motion/InView'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { SiteSetting } from '@/payload-types'

import { ContactForm } from './ContactForm'

export function Contact({ settings }: { settings: SiteSetting }) {
  const t = useTranslations('contact')

  const items = [
    {
      icon: Phone,
      label: t('phone'),
      value: settings.phone,
      href: `tel:${settings.phone.replace(/[^\d+]/g, '')}`,
    },
    { icon: Mail, label: t('email'), value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: t('address'), value: settings.address },
    { icon: Clock, label: t('hours'), value: settings.hours },
  ]

  return (
    <section id="contact" className="bg-ink py-24 text-sand-50 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} tone="dark" />
          <InView amount={0.2}>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {items.map(({ icon: Icon, label, value, href }, index) => (
                <li
                  key={label}
                  className="reveal-fade flex gap-4"
                  style={{ '--d': `${index * 80}ms` } as CSSProperties}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10">
                    <Icon className="size-5 text-accent-500" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm text-sand-300">{label}</p>
                    <p className="mt-0.5 font-semibold">
                      {href ? (
                        <a href={href} className="hover:text-accent-500">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </InView>
        </div>

        <ContactForm />
      </Container>
    </section>
  )
}
