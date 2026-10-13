import AxeBuilder from '@axe-core/playwright'

import { expect, test } from './fixtures'

test.use({ reducedMotion: 'reduce' })

for (const path of ['/uk', '/en', '/uk/projects/podil-apartment', '/uk/credits']) {
  test(`${path} has no WCAG A or AA violations`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(
      results.violations.map(({ id, nodes }) => ({
        id,
        targets: nodes.map((node) => node.target),
      })),
    ).toEqual([])
  })
}
