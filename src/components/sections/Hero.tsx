import { ArrowRight, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import heroImage from '@/assets/hero.webp'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export type HeroStat = {
  key: 'years' | 'projects' | 'warranty'
  value: number
  suffix?: string
}

export function Hero({ stats }: { stats: HeroStat[] }) {
  const t = useTranslations('hero')

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 -z-10 h-[38rem] w-[min(60rem,70vw)] rounded-bl-[10rem] bg-sand-100"
      />

      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-accent-700">
            <span className="h-px w-8 bg-accent-500" aria-hidden="true" />
            {t('eyebrow')}
          </p>

          <h1 className="font-display text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-[4.25rem]">
            {t.rich('title', {
              accent: (chunks) => <span className="text-accent-600">{chunks}</span>,
            })}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t('lead')}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={{ pathname: '/', hash: 'pricing' }} size="lg">
              {t('primary')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={{ pathname: '/', hash: 'projects' }} size="lg" variant="outline">
              {t('secondary')}
            </ButtonLink>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/10 pt-8">
            {stats.map((stat) => (
              <div key={stat.key} className="flex flex-col gap-1">
                <dt className="order-2 text-sm leading-snug text-muted">
                  {t(`stats.${stat.key}`)}
                </dt>
                <dd className="order-1 font-display text-3xl font-semibold sm:text-4xl">
                  {stat.value}
                  {stat.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[14rem] rounded-b-[2rem] shadow-card">
            <Image
              src={heroImage}
              alt={t('imageAlt')}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, (min-width: 640px) 36rem, 100vw"
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-8 -left-3 max-w-[16.5rem] rounded-2xl bg-white/90 p-5 shadow-card backdrop-blur sm:-left-10">
            <ShieldCheck className="size-6 text-accent-600" aria-hidden="true" />
            <p className="mt-3 font-semibold">{t('badgeTitle')}</p>
            <p className="mt-1 text-sm leading-snug text-muted">{t('badgeText')}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
