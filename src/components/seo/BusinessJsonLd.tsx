import { siteUrl } from '@/lib/seo'
import type { SiteSetting } from '@/payload-types'

type Props = {
  settings: SiteSetting
  locale: string
  description: string
}

export function BusinessJsonLd({ settings, locale, description }: Props) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: 'Oselia Studio',
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/icon.svg`,
    image: `${siteUrl}/${locale}/opengraph-image`,
    description,
    telephone: settings.phone,
    email: settings.email,
    priceRange: '₴₴',
    areaServed: { '@type': 'City', name: locale === 'uk' ? 'Київ' : 'Kyiv' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: locale === 'uk' ? 'Київ' : 'Kyiv',
      addressCountry: 'UA',
    },
    sameAs: (settings.socials ?? []).map((social) => social.url),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
