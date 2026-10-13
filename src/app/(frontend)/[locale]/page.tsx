import { setRequestLocale } from 'next-intl/server'

import { Hero } from '@/components/sections/Hero'
import { resolveLocale } from '@/i18n/locale'

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  setRequestLocale(resolveLocale((await params).locale))

  return (
    <Hero
      stats={[
        { key: 'years', value: 12 },
        { key: 'projects', value: 240, suffix: '+' },
        { key: 'warranty', value: 3 },
      ]}
    />
  )
}
