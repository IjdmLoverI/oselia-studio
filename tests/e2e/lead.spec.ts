import type { Page } from '@playwright/test'

import { expect, test } from './fixtures'

const serverAction = { timeout: 20_000 }

async function useFreshAddress(page: Page) {
  const octet = () => Math.floor(Math.random() * 250) + 1
  await page.setExtraHTTPHeaders({ 'x-forwarded-for': `10.${octet()}.${octet()}.${octet()}` })
}

test('the calculator estimate travels into the request form', async ({ page }) => {
  await useFreshAddress(page)
  await page.goto('/uk')

  const calculator = page.locator('#pricing')
  await calculator.getByText('Дизайнерський', { exact: true }).click()
  await calculator.getByText('Дизайн-проєкт', { exact: true }).click()
  await expect(calculator.locator('[aria-live="polite"]')).toHaveText('942 000 – 1 204 000 грн')

  await calculator.getByRole('link', { name: 'Отримати точний кошторис' }).click()
  const contact = page.locator('#contact')
  await expect(contact.getByText('Розрахунок з калькулятора')).toBeVisible()
  await expect(contact.getByText(/68 м², Дизайнерський/)).toBeVisible()

  await contact.getByLabel('Ім’я').fill('E2E Олена')
  await contact.getByLabel('Телефон', { exact: true }).fill('067 123 45 67')
  await contact.getByText('Погоджуюся на обробку персональних даних').click()
  await page.waitForTimeout(3100)
  await contact.getByRole('button', { name: 'Надіслати заявку' }).click()

  await expect(contact.getByText('Дякуємо! Заявку отримали')).toBeVisible(serverAction)
})

test('the form explains what is missing', async ({ page }) => {
  await useFreshAddress(page)
  await page.goto('/uk')

  const contact = page.locator('#contact')
  await contact.getByLabel('Ім’я').fill('А')
  await contact.getByLabel('Телефон', { exact: true }).fill('123')
  await page.waitForTimeout(3100)
  await contact.getByRole('button', { name: 'Надіслати заявку' }).click()

  await expect(contact.getByText('Вкажіть ім’я')).toBeVisible(serverAction)
  await expect(contact.getByText('Перевірте номер телефону')).toBeVisible()
  await expect(contact.getByText('Потрібна ваша згода')).toBeVisible()
  await expect(contact.getByLabel('Ім’я')).toHaveAttribute('aria-invalid', 'true')
})

test('a form sent faster than a person could type is refused', async ({ page }) => {
  await useFreshAddress(page)
  await page.goto('/uk')

  const contact = page.locator('#contact')
  await contact.getByLabel('Ім’я').fill('Швидкий бот')
  await contact.getByLabel('Телефон', { exact: true }).fill('067 123 45 67')
  await contact.getByText('Погоджуюся на обробку персональних даних').click()
  await contact.getByRole('button', { name: 'Надіслати заявку' }).click()

  await expect(contact.getByRole('alert')).toContainText('занадто швидко', serverAction)
})
