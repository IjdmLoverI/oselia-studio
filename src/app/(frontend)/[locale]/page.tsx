import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { SketchToReality } from '@/components/sections/SketchToReality'
import { resolveLocale } from '@/i18n/locale'

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const locale = resolveLocale((await params).locale)
  setRequestLocale(locale)
  const t = await getTranslations({ locale })

  return (
    <>
      <Hero
        stats={[
          { key: 'years', value: 12 },
          { key: 'projects', value: 240, suffix: '+' },
          { key: 'warranty', value: 3 },
        ]}
      />
      <Marquee
        items={(['apartments', 'houses', 'kitchens', 'bathrooms', 'offices', 'cafes'] as const).map(
          (item) => t(`marquee.${item}`),
        )}
      />
      <SketchToReality
        eyebrow={t('showcase.eyebrow')}
        title={t('showcase.title')}
        sketchLabel={t('showcase.sketch')}
        resultLabel={t('showcase.result')}
        sketchAlt={t('showcase.sketchAlt')}
        photoAlt={t('showcase.photoAlt')}
        steps={(['sketch', 'materials', 'build'] as const).map((step) => ({
          title: t(`showcase.steps.${step}.title`),
          text: t(`showcase.steps.${step}.text`),
        }))}
      />
      <div className="h-[60vh]" />
    </>
  )
}
