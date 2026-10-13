import { z } from 'zod'

const optional = z.preprocess((value) => (value === '' ? undefined : value), z.string().optional())

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  PAYLOAD_SECRET: z.string().min(32),
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  TELEGRAM_BOT_TOKEN: optional,
  TELEGRAM_CHAT_ID: optional,
  BLOB_READ_WRITE_TOKEN: optional,
  SITE_INDEXING: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
})

export const env = schema.parse(process.env)
