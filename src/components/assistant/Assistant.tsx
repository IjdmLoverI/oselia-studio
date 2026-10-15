import type { Locale } from '@/i18n/routing'
import { isAssistantConfigured } from '@/lib/assistant/model'
import { loadSettings } from '@/lib/assistant/store'

import { AssistantWidget } from './AssistantWidget'

export async function Assistant({ locale }: { locale: Locale }) {
  if (!isAssistantConfigured()) return null
  const settings = await loadSettings(locale)
  return settings.enabled ? <AssistantWidget greeting={settings.greeting} /> : null
}
