import { callTelegram } from '@/lib/telegram'

const token = process.env.TELEGRAM_BOT_TOKEN
const secret = process.env.TELEGRAM_WEBHOOK_SECRET
const target = new URL(
  '/api/assistant/telegram',
  process.argv.find((arg) => arg.startsWith('http')) ?? 'http://localhost:3000',
)

if (!token || !secret) {
  console.error('Set TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET first.')
  process.exit(1)
}

const webhook = (await callTelegram(token, 'getWebhookInfo', {})).result as { url: string }
if (webhook.url) {
  console.error(`The bot already delivers to ${webhook.url}. Polling would steal its updates.`)
  process.exit(1)
}

console.log(`Forwarding updates to ${target}. Stop with Ctrl+C.`)
let offset = 0

for (;;) {
  const { result } = await callTelegram(token, 'getUpdates', {
    offset,
    timeout: 8,
    allowed_updates: ['message'],
  })
  for (const update of result as { update_id: number }[]) {
    offset = update.update_id + 1
    const response = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Bot-Api-Secret-Token': secret,
      },
      body: JSON.stringify(update),
    })
    console.log(`update ${update.update_id} → ${response.status}`)
  }
}
