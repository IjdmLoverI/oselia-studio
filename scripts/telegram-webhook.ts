import { callTelegram } from '@/lib/telegram'

const token = process.env.TELEGRAM_BOT_TOKEN
const secret = process.env.TELEGRAM_WEBHOOK_SECRET
const site = process.argv.find((arg) => arg.startsWith('http')) ?? process.env.NEXT_PUBLIC_SITE_URL

if (!token) {
  console.error('Set TELEGRAM_BOT_TOKEN first.')
  process.exit(1)
}

if (process.argv.includes('--delete')) {
  await callTelegram(token, 'deleteWebhook', { drop_pending_updates: true })
  console.log('Webhook removed.')
  process.exit(0)
}

if (!secret || !site?.startsWith('https://')) {
  console.error('Set TELEGRAM_WEBHOOK_SECRET and pass the public https:// site address.')
  process.exit(1)
}

const url = new URL('/api/assistant/telegram', site).toString()

await callTelegram(token, 'setWebhook', {
  url,
  secret_token: secret,
  allowed_updates: ['message'],
  drop_pending_updates: true,
})

const profiles = [
  {
    language_code: 'uk',
    command: 'Почати розмову',
    short: 'Ціни на ремонт і запис на безкоштовний виїзд архітектора.',
    long: 'Асистент концепт-сайту Oselia Studio. Підкаже орієнтовну вартість ремонту, відповість на питання й запише на безкоштовний виїзд. Студія вигадана, це демонстрація.',
  },
  {
    language_code: '',
    command: 'Start a conversation',
    short: 'Renovation prices and free site visit booking.',
    long: 'The assistant of the Oselia Studio concept site. It estimates renovation costs, answers questions and books a free site visit. The studio is fictional; this is a demo.',
  },
]

for (const profile of profiles) {
  const language = profile.language_code ? { language_code: profile.language_code } : {}
  await callTelegram(token, 'setMyCommands', {
    commands: [{ command: 'start', description: profile.command }],
    ...language,
  })
  await callTelegram(token, 'setMyShortDescription', {
    short_description: profile.short,
    ...language,
  })
  await callTelegram(token, 'setMyDescription', { description: profile.long, ...language })
}

const info = (await callTelegram(token, 'getWebhookInfo', {})).result as {
  url: string
  pending_update_count: number
  last_error_message?: string
}
console.log(`Webhook set to ${info.url}`)
if (info.last_error_message) console.log(`Last delivery error: ${info.last_error_message}`)
