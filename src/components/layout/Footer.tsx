import { useTranslations } from 'next-intl'

import { Container } from '@/components/ui/Container'
import { Link } from '@/i18n/navigation'
import type { SiteSetting } from '@/payload-types'

import { Logo } from './Logo'
import { sections } from './navigation'
import { SectionLink } from './SectionLink'

export function Footer({ settings }: { settings: SiteSetting }) {
  const t = useTranslations()

  return (
    <footer className="border-t border-white/10 bg-ink text-sand-200">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" aria-label={t('common.home')} className="inline-block text-sand-50">
            <Logo />
          </Link>
          <p className="mt-4 leading-relaxed">{t('footer.tagline')}</p>
          <p className="mt-4 text-sm text-sand-300">{t('footer.disclaimer')}</p>
        </div>

        <nav aria-label={t('footer.navigation')}>
          <p className="text-sm font-semibold tracking-wide text-sand-50 uppercase">
            {t('footer.navigation')}
          </p>
          <ul className="mt-4 space-y-2">
            {sections.map((section) => (
              <li key={section}>
                <SectionLink section={section} className="hover:text-sand-50">
                  {t(`nav.${section}`)}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold tracking-wide text-sand-50 uppercase">
            {t('footer.contacts')}
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                className="hover:text-sand-50"
              >
                {settings.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="hover:text-sand-50">
                {settings.email}
              </a>
            </li>
            <li>{settings.address}</li>
            <li>{settings.hours}</li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-sand-300 sm:flex-row sm:justify-between">
        <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
        <Link href="/credits" className="hover:text-sand-50">
          {t('footer.photos')}
        </Link>
      </Container>
    </footer>
  )
}
