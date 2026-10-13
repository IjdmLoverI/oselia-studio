import type { Metadata } from 'next'

import { env } from '@/env'
import { routing, type Locale } from '@/i18n/routing'

export const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')

const openGraphLocale: Record<Locale, string> = { uk: 'uk_UA', en: 'en_US' }

export function localizedAlternates(locale: Locale, path = ''): Metadata['alternates'] {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((code) => [code, `/${code}${path}`])),
      'x-default': `/${routing.defaultLocale}${path}`,
    },
  }
}

export function baseMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    applicationName: 'Oselia Studio',
    robots: env.SITE_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: 'website',
      siteName: 'Oselia Studio',
      locale: openGraphLocale[locale],
      alternateLocale: routing.locales
        .filter((code) => code !== locale)
        .map((code) => openGraphLocale[code]),
    },
    twitter: { card: 'summary_large_image' },
  }
}
