import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Contact } from '@/components/sections/Contact'
import { Faq } from '@/components/sections/Faq'
import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { PricingSection } from '@/components/sections/PricingSection'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'
import { SketchToReality } from '@/components/sections/SketchToReality'
import { Testimonials } from '@/components/sections/Testimonials'
import { BusinessJsonLd } from '@/components/seo/BusinessJsonLd'
import { resolveLocale } from '@/i18n/locale'
import {
  getFaqs,
  getPricing,
  getProjects,
  getServices,
  getSiteSettings,
  getTestimonials,
} from '@/lib/content'
import { localizedAlternates } from '@/lib/seo'

const marqueeItems = ['apartments', 'houses', 'kitchens', 'bathrooms', 'offices', 'cafes'] as const
const steps = ['sketch', 'materials', 'build'] as const

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  return { alternates: localizedAlternates(resolveLocale((await params).locale)) }
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const locale = resolveLocale((await params).locale)
  setRequestLocale(locale)

  const [t, settings, services, projects, pricing, testimonials, faqs] = await Promise.all([
    getTranslations({ locale }),
    getSiteSettings(locale),
    getServices(locale),
    getProjects(locale),
    getPricing(locale),
    getTestimonials(locale),
    getFaqs(locale),
  ])

  return (
    <>
      <BusinessJsonLd settings={settings} locale={locale} description={t('meta.description')} />
      <Hero
        stats={[
          { key: 'years', value: settings.stats.years },
          { key: 'projects', value: settings.stats.projects, suffix: '+' },
          { key: 'warranty', value: settings.stats.warranty },
        ]}
      />
      <Marquee items={marqueeItems.map((item) => t(`marquee.${item}`))} />
      <Services services={services} />
      <SketchToReality
        eyebrow={t('showcase.eyebrow')}
        title={t('showcase.title')}
        sketchLabel={t('showcase.sketch')}
        resultLabel={t('showcase.result')}
        sketchAlt={t('showcase.sketchAlt')}
        photoAlt={t('showcase.photoAlt')}
        steps={steps.map((step) => ({
          title: t(`showcase.steps.${step}.title`),
          text: t(`showcase.steps.${step}.text`),
        }))}
      />
      <Projects projects={projects} />
      <PricingSection pricing={pricing} />
      <Testimonials testimonials={testimonials} />
      <Faq faqs={faqs} />
      <Contact settings={settings} />
    </>
  )
}
