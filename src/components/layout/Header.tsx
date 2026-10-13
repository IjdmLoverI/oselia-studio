'use client'

import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { buttonStyles } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { LocaleSwitcher } from './LocaleSwitcher'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { sections } from './navigation'
import { SectionLink } from './SectionLink'

export function Header() {
  const t = useTranslations()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(current > 24)
    setHidden(current > previous && current > 240)
  })

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300',
        scrolled
          ? 'bg-sand-50/80 shadow-[0_1px_0_rgb(29_29_27/0.08)] backdrop-blur-lg'
          : 'bg-transparent',
      )}
    >
      <Container className="intro-fade flex h-18 items-center justify-between gap-6">
        <Link href="/" aria-label={t('common.home')} className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label={t('nav.main')} className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm font-medium">
            {sections.map((section) => (
              <li key={section}>
                <SectionLink
                  section={section}
                  className="relative text-ink/75 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:text-ink hover:after:origin-left hover:after:scale-x-100"
                >
                  {t(`nav.${section}`)}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher className="hidden sm:flex" />
          <SectionLink section="pricing" className={cn(buttonStyles(), 'hidden md:inline-flex')}>
            {t('nav.cta')}
          </SectionLink>
          <MobileMenu />
        </div>
      </Container>
    </motion.header>
  )
}
