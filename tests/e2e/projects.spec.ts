import { expect, test } from './fixtures'

test('the filter shows only projects of the chosen type', async ({ page }) => {
  await page.goto('/uk')
  const section = page.locator('#projects')
  const cards = section.getByRole('listitem')

  await expect(cards).toHaveCount(6)
  await section.getByRole('button', { name: 'Санвузли' }).click()
  await expect(cards).toHaveCount(1)
  await expect(cards.first()).toContainText('Санвузол у сталінці')

  await section.getByRole('button', { name: 'Усі' }).click()
  await expect(cards).toHaveCount(6)
})

test('project covers on the home page are revealed when they scroll into view', async ({
  page,
}) => {
  await page.goto('/uk')
  const covers = page.locator('#projects .reveal-image')

  await covers.first().scrollIntoViewIfNeeded()
  await expect(covers.first()).toHaveCSS('clip-path', 'inset(0px)')
})

test('a project card opens the project page', async ({ page }) => {
  await page.goto('/uk')
  await page
    .locator('#projects')
    .getByRole('link', { name: /Квартира на Подолі/ })
    .click()

  await expect(page).toHaveURL(/\/uk\/projects\/podil-apartment$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Квартира на Подолі')
  await expect(page.getByText('68 м²').first()).toBeVisible()
})

test('the sketch slider works from the keyboard', async ({ page }) => {
  await page.goto('/uk/projects/podil-apartment')
  const slider = page.getByRole('slider', { name: 'Порівняння ескізу й готового інтер’єру' })

  await expect(slider).toHaveAttribute('aria-valuetext', '50%')
  await slider.focus()
  await page.keyboard.press('End')
  await expect(slider).toHaveAttribute('aria-valuetext', '100%')
  await page.keyboard.press('Home')
  await expect(slider).toHaveAttribute('aria-valuetext', '0%')
})

test('project pages exist in both languages', async ({ page }) => {
  await page.goto('/en/projects/bucha-townhouse')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Townhouse in Bucha')
  await expect(page.locator('link[rel="alternate"][hreflang="uk"]')).toHaveAttribute(
    'href',
    /\/uk\/projects\/bucha-townhouse$/,
  )
})

test('an unknown project shows the not found page', async ({ page }) => {
  const response = await page.goto('/uk/projects/missing-project')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'Такої сторінки немає' })).toBeVisible()
})
