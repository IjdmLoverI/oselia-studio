import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Container } from '@/components/ui/Container'
import { resolveLocale } from '@/i18n/locale'
import { getMediaCredits } from '@/lib/content'
import { localizedAlternates } from '@/lib/seo'

const brandPhotos = [{ author: 'Spacejoy', url: 'https://unsplash.com/photos/9M66C_w_ToM' }]

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/credits'>): Promise<Metadata> {
  const locale = resolveLocale((await params).locale)
  const t = await getTranslations({ locale, namespace: 'credits' })
  return { title: t('title'), alternates: localizedAlternates(locale, '/credits') }
}

export default async function CreditsPage({ params }: PageProps<'/[locale]/credits'>) {
  const locale = resolveLocale((await params).locale)
  setRequestLocale(locale)
  const [t, media] = await Promise.all([
    getTranslations({ locale, namespace: 'credits' }),
    getMediaCredits(),
  ])

  const credits = [
    ...brandPhotos,
    ...media.map((doc) => ({ author: doc.credit?.author ?? '', url: doc.credit?.url ?? '' })),
  ].filter(
    (credit, index, all) =>
      credit.author && credit.url && all.findIndex((other) => other.url === credit.url) === index,
  )

  return (
    <Container className="max-w-3xl pt-36 pb-24">
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        {t('title')}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">{t('lead')}</p>
      <ul className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
        {credits.map((credit) => (
          <li key={credit.url} className="flex items-center justify-between gap-6 py-4">
            <span className="font-semibold">{credit.author}</span>
            <a
              href={credit.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-accent-700 underline-offset-4 hover:underline"
            >
              unsplash.com
            </a>
          </li>
        ))}
      </ul>
    </Container>
  )
}
