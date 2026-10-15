import AxeBuilder from '@axe-core/playwright'
import type { Locator, Page, Route } from '@playwright/test'

import { expect, test } from './fixtures'

const reply =
  'Косметичний ремонт 50 м² коштує орієнтовно 243–311 тис. грн за роботи, без матеріалів.'

type ChatRequest = { conversationId: string; locale: string; message: string }

async function mockChat(page: Page, handler: (route: Route) => Promise<void>) {
  const requests: ChatRequest[] = []
  await page.route('**/api/assistant/chat', async (route) => {
    requests.push(route.request().postDataJSON() as ChatRequest)
    await handler(route)
  })
  return requests
}

const bubble = (scope: Page | Locator, text: string) =>
  scope.getByRole('paragraph').filter({ hasText: text })

const answer = (route: Route) =>
  route.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8', body: reply })

test('the assistant answers a suggested question', async ({ page }) => {
  const requests = await mockChat(page, answer)
  await page.goto('/uk')

  await page.getByRole('button', { name: 'Запитати асистента' }).click()
  const panel = page.getByRole('dialog', { name: 'Асистент Oselia' })
  await expect(panel).toBeVisible()
  await expect(panel.getByRole('textbox')).toBeFocused()

  const question = 'Скільки коштує ремонт квартири 60 м²?'
  await panel.getByRole('button', { name: question }).click()

  await expect(bubble(panel, question)).toBeVisible()
  await expect(bubble(panel, reply)).toBeVisible()
  expect(requests).toEqual([
    { conversationId: expect.stringMatching(/^[0-9a-f-]{36}$/), locale: 'uk', message: question },
  ])
})

test('the conversation survives a reload and can be restarted', async ({ page }) => {
  await mockChat(page, answer)
  await page.goto('/en')

  await page.getByRole('button', { name: 'Ask the assistant' }).click()
  const panel = page.getByRole('dialog', { name: 'Oselia assistant' })
  await panel.getByRole('textbox').fill('How long does a full renovation take?')
  await panel.getByRole('textbox').press('Enter')
  await expect(bubble(panel, reply)).toBeVisible()

  await page.reload()
  await page.getByRole('button', { name: 'Ask the assistant' }).click()
  await expect(bubble(panel, reply)).toBeVisible()

  await panel.getByRole('button', { name: 'Start a new chat' }).click()
  await expect(bubble(panel, reply)).toHaveCount(0)
  await expect(
    panel.getByRole('button', { name: 'I would like to book a free site visit' }),
  ).toBeVisible()
})

test('a failed request can be retried', async ({ page }) => {
  let fail = true
  await mockChat(page, (route) =>
    fail ? route.fulfill({ status: 502, body: 'Bad gateway' }) : answer(route),
  )
  await page.goto('/uk')

  await page.getByRole('button', { name: 'Запитати асистента' }).click()
  const panel = page.getByRole('dialog', { name: 'Асистент Oselia' })
  await panel.getByRole('textbox').fill('Привіт')
  await panel.getByRole('button', { name: 'Надіслати' }).click()

  await expect(panel.getByRole('alert')).toContainText('Не вдалося звʼязатися з асистентом.')
  fail = false
  await panel.getByRole('button', { name: 'Спробувати ще раз' }).click()
  await expect(bubble(panel, reply)).toBeVisible()
  await expect(bubble(panel, 'Привіт')).toHaveCount(1)
})

test('Escape closes the assistant and returns focus to the launcher', async ({ page }) => {
  await page.goto('/uk')
  const launcher = page.getByRole('button', { name: 'Запитати асистента' })

  await launcher.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')

  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(launcher).toBeFocused()
})

test.describe('accessibility', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the open assistant has no WCAG A or AA violations', async ({ page }) => {
    await mockChat(page, answer)
    await page.goto('/uk')
    await page.getByRole('button', { name: 'Запитати асистента' }).click()
    await page.getByRole('button', { name: 'Хочу записатися на безкоштовний виїзд' }).click()
    await expect(bubble(page, reply)).toBeVisible()

    const results = await new AxeBuilder({ page })
      .include('#assistant-panel')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(results.violations.map(({ id }) => id)).toEqual([])
  })
})

test.describe('chat endpoint', () => {
  test('refuses requests from other sites', async ({ request }) => {
    const response = await request.post('/api/assistant/chat', {
      headers: { Origin: 'https://example.com' },
      data: {},
    })
    expect(response.status()).toBe(403)
  })

  test('refuses malformed requests', async ({ request }) => {
    const response = await request.post('/api/assistant/chat', {
      data: { conversationId: 'not-a-uuid', locale: 'uk', message: 'Привіт' },
    })
    expect(response.status()).toBe(400)
  })
})

test.describe('Telegram webhook', () => {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET
  test.skip(!secret, 'needs TELEGRAM_WEBHOOK_SECRET')

  test('rejects a request without the secret header', async ({ request }) => {
    const response = await request.post('/api/assistant/telegram', {
      headers: { 'X-Telegram-Bot-Api-Secret-Token': 'wrong' },
      data: { update_id: 1 },
    })
    expect(response.status()).toBe(401)
  })

  test('acknowledges updates it does not answer', async ({ request }) => {
    const response = await request.post('/api/assistant/telegram', {
      headers: { 'X-Telegram-Bot-Api-Secret-Token': secret! },
      data: { update_id: 2, edited_message: { text: 'hi' } },
    })
    expect(response.status()).toBe(200)
  })
})
