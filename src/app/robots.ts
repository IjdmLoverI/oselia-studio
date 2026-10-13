import type { MetadataRoute } from 'next'

import { env } from '@/env'
import { siteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  if (!env.SITE_INDEXING) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
