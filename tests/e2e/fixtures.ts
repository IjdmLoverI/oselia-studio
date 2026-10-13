import { test as base } from '@playwright/test'

export { expect } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript(() => window.sessionStorage.setItem('oselia-intro', '1'))
    await provide(page)
  },
})
