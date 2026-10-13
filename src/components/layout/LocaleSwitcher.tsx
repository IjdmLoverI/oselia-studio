'use client'

import { useLocale, useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

const labels = { uk: 'UA', en: 'EN' } as const

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const current = useLocale()

  return (
    <nav aria-label={t('language')} className={cn('flex items-center gap-1 text-sm', className)}>
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          hrefLang={locale}
          aria-current={locale === current ? 'true' : undefined}
          className={cn(
            'rounded-full px-2.5 py-1 font-semibold transition-colors',
            locale === current ? 'bg-ink text-sand-50' : 'text-muted hover:text-ink',
          )}
        >
          {labels[locale]}
        </Link>
      ))}
    </nav>
  )
}
