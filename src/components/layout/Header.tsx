'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { LocaleSwitcher } from './LocaleSwitcher'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { sections } from './navigation'

export function Header() {
  const t = useTranslations()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300',
        scrolled
          ? 'bg-sand-50/80 shadow-[0_1px_0_rgb(29_29_27/0.08)] backdrop-blur-lg'
          : 'bg-transparent',
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link href="/" aria-label={t('common.home')} className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label={t('nav.main')} className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm font-medium">
            {sections.map((section) => (
              <li key={section}>
                <Link
                  href={{ pathname: '/', hash: section }}
                  className="text-ink/75 transition-colors hover:text-ink"
                >
                  {t(`nav.${section}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher className="hidden sm:flex" />
          <ButtonLink href={{ pathname: '/', hash: 'pricing' }} className="hidden md:inline-flex">
            {t('nav.cta')}
          </ButtonLink>
          <MobileMenu />
        </div>
      </Container>
    </header>
  )
}
