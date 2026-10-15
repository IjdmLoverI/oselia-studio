import { createHash } from 'crypto'

export const clientIp = (headers: Headers) =>
  headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

export const hashClient = (value: string, secret: string) =>
  createHash('sha256').update(`${value}:${secret}`).digest('hex')
