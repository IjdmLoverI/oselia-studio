import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { uk } from '@payloadcms/translations/languages/uk'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Faqs } from './collections/Faqs'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { env } from './env'
import { Pricing } from './globals/Pricing'
import { SiteSettings } from './globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Oselia Studio' },
  },
  i18n: {
    supportedLanguages: { uk, en },
    fallbackLanguage: 'uk',
  },
  localization: {
    locales: [
      { label: 'Українська', code: 'uk' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'uk',
    fallback: true,
  },
  collections: [Projects, Services, Testimonials, Faqs, Media, Leads, Users],
  globals: [SiteSettings, Pricing],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  serverURL: env.NEXT_PUBLIC_SITE_URL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: env.DATABASE_URL },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(env.BLOB_READ_WRITE_TOKEN),
      collections: { media: { disablePayloadAccessControl: true } },
      token: env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  sharp,
})
