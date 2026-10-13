import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import { resolveLocale } from '@/i18n/locale'

export default function HomePage({ params }: PageProps<'/[locale]'>) {
  setRequestLocale(resolveLocale(use(params).locale))
  const t = useTranslations('hero')

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="font-display text-5xl leading-tight">{t('title')}</h1>
    </main>
  )
}
