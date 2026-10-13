import { ArrowRight, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { CSSProperties } from 'react'

import heroImage from '@/assets/hero.webp'
import { CountUp } from '@/components/motion/CountUp'
import { MaterialSpheres } from '@/components/motion/MaterialSpheres'
import { RevealWords, wordCount } from '@/components/motion/RevealWords'
import { SectionLink } from '@/components/layout/SectionLink'
import { buttonStyles } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export type HeroStat = {
  key: 'years' | 'projects' | 'warranty'
  value: number
  suffix?: string
}

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export function Hero({ stats }: { stats: HeroStat[] }) {
  const t = useTranslations('hero')
  const materials = useTranslations('materials')
  const titleStart = t('titleStart')

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-28">
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 -z-10 h-[38rem] w-[min(60rem,70vw)] rounded-bl-[10rem] bg-sand-100"
      />

      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <p
            className="intro-fade mb-6 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-accent-700"
            style={delay(0)}
          >
            <span className="h-px w-8 bg-accent-500" aria-hidden="true" />
            {t('eyebrow')}
          </p>

          <h1 className="intro font-display text-[2.6rem] leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-[4.25rem]">
            <RevealWords text={titleStart} />
            <RevealWords
              text={t('titleAccent')}
              offset={wordCount(titleStart)}
              className="text-accent-600"
            />
          </h1>

          <p
            className="intro-fade mt-6 max-w-xl text-lg leading-relaxed text-muted"
            style={delay(450)}
          >
            {t('lead')}
          </p>

          <div className="intro-fade mt-9 flex flex-col gap-3 sm:flex-row" style={delay(600)}>
            <SectionLink section="pricing" className={buttonStyles({ size: 'lg' })}>
              {t('primary')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </SectionLink>
            <SectionLink
              section="projects"
              className={buttonStyles({ size: 'lg', variant: 'outline' })}
            >
              {t('secondary')}
            </SectionLink>
          </div>

          <dl
            className="intro-fade mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/10 pt-8"
            style={delay(750)}
          >
            {stats.map((stat) => (
              <div key={stat.key} className="flex flex-col gap-1">
                <dt className="order-2 text-sm leading-snug text-muted">
                  {t(`stats.${stat.key}`)}
                </dt>
                <dd className="order-1 font-display text-3xl font-semibold tabular-nums sm:text-4xl">
                  <CountUp value={stat.value} suffix={stat.suffix} afterIntro />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="intro-arch relative aspect-[4/5] overflow-hidden rounded-t-[14rem] rounded-b-[2rem] shadow-card">
            <div className="intro-zoom absolute inset-0">
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
          </div>

          <MaterialSpheres
            labels={{
              stone: materials('stone'),
              oak: materials('oak'),
              terracotta: materials('terracotta'),
              linen: materials('linen'),
            }}
          />

          <div
            className="intro-fade absolute bottom-10 -left-3 max-w-[16.5rem] rounded-2xl bg-white/90 p-5 shadow-card backdrop-blur sm:-left-10"
            style={delay(900)}
          >
            <ShieldCheck className="size-6 text-accent-600" aria-hidden="true" />
            <p className="mt-3 font-semibold">{t('badgeTitle')}</p>
            <p className="mt-1 text-sm leading-snug text-muted">{t('badgeText')}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
