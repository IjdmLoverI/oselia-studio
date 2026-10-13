import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'

import { routing, type Locale } from './routing'

export function resolveLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) notFound()
  return value
}
