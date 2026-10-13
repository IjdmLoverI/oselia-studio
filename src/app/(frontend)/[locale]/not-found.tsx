import { useTranslations } from 'next-intl'

import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <Container className="flex min-h-[70vh] flex-col items-start justify-center pt-28 pb-24">
      <p className="font-display text-7xl font-semibold text-accent-500">404</p>
      <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">{t('title')}</h1>
      <p className="mt-3 text-lg text-muted">{t('text')}</p>
      <ButtonLink href="/" size="lg" className="mt-8">
        {t('home')}
      </ButtonLink>
    </Container>
  )
}
