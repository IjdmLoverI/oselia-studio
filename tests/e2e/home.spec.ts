import { expect, test } from './fixtures'

test.describe('a Ukrainian browser', () => {
  test.use({ locale: 'uk-UA' })

  test('lands on the Ukrainian home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/uk$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Ремонт')
  })
})

test.describe('an English browser', () => {
  test.use({ locale: 'en-US' })

  test('lands on the English home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/en$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Renovation')
  })
})

test('the language switcher keeps the page and changes the language', async ({
  page,
  isMobile,
}) => {
  await page.goto('/uk')

  if (isMobile) {
    await page.getByRole('button', { name: 'Відкрити меню' }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'EN' }).click()
  } else {
    await page
      .getByRole('navigation', { name: 'Мова сайту' })
      .getByRole('link', { name: 'EN' })
      .click()
  }

  await expect(page).toHaveURL(/\/en$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Renovation')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('every section is reachable from the navigation', async ({ page }) => {
  await page.goto('/uk')
  for (const id of ['services', 'projects', 'process', 'pricing', 'faq', 'contact']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
})

test('the mobile menu opens and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu button only exists on small screens')
  await page.goto('/uk')

  await page.getByRole('button', { name: 'Відкрити меню' }).click()
  const menu = page.getByRole('dialog', { name: 'Головна навігація' })
  await expect(menu).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
})

test('the FAQ opens one answer at a time', async ({ page }) => {
  await page.goto('/uk')
  const items = page.locator('#faq details')

  await items.nth(0).locator('summary').click()
  await expect(items.nth(0)).toHaveAttribute('open', '')

  await items.nth(1).locator('summary').click()
  await expect(items.nth(1)).toHaveAttribute('open', '')
  await expect(items.nth(0)).not.toHaveAttribute('open', '')
})

test('search engines are kept away from the concept site', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Disallow: /')

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.ok()).toBeTruthy()
  expect(await sitemap.text()).toContain('/projects/')
})
