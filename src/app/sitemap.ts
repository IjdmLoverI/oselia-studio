import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { getProjects } from '@/lib/content'
import { siteUrl } from '@/lib/seo'

function entry(path: string, lastModified?: string): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}/${routing.defaultLocale}${path}`,
    lastModified,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`]),
      ),
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects(routing.defaultLocale)

  return [
    entry(''),
    ...projects.map((project) => entry(`/projects/${project.slug}`, project.updatedAt)),
  ]
}
