import type { Metadata } from 'next'
import { Manrope, Unbounded } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Header } from '@/components/layout/Header'
import { MoodSwitcher } from '@/components/layout/MoodSwitcher'
import { Preloader } from '@/components/layout/Preloader'
import { Cursor } from '@/components/motion/Cursor'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { env } from '@/env'
import { resolveLocale } from '@/i18n/locale'
import { routing } from '@/i18n/routing'

import '../globals.css'

const bootScript = `try{var r=document.documentElement;r.classList.add('js');if(sessionStorage.getItem('oselia-intro'))r.dataset.intro='seen';else sessionStorage.setItem('oselia-intro','1');var m=localStorage.getItem('oselia-mood');if(m&&m!=='terracotta')r.dataset.mood=m}catch(e){}`

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
})

const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-unbounded',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const locale = resolveLocale((await params).locale)
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: { default: t('title'), template: '%s · Oselia Studio' },
    description: t('description'),
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const locale = resolveLocale((await params).locale)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'common' })

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${unbounded.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <Preloader />
        <NextIntlClientProvider>
          <a
            href="#content"
            className="sr-only z-50 rounded-full bg-ink px-5 py-3 text-sand-50 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
          >
            {t('skipToContent')}
          </a>
          <Header />
          <main id="content">{children}</main>
          <MoodSwitcher />
          <Cursor />
          <SmoothScroll />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
