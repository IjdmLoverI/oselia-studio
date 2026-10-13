import { chromium } from '@playwright/test'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { textures } from './textures'

const outDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../src/assets/materials',
)
const size = 320

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: size, height: size } })

for (const [name, svg] of Object.entries(textures)) {
  const background = `url("data:image/svg+xml,${encodeURIComponent(svg)}") center / cover`
  await page.setContent(
    `<style>body{margin:0}div{width:${size}px;height:${size}px;background:${background}}</style><div></div>`,
  )
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: size, height: size } })
  await sharp(png)
    .webp({ quality: 82 })
    .toFile(path.join(outDir, `${name}.webp`))
  console.log(`Rendered ${name}`)
}

await browser.close()
