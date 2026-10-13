import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'

import { resolveLocale } from '@/i18n/locale'
import { loadGoogleFont } from '@/lib/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Oselia Studio'

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale)
  const t = await getTranslations({ locale, namespace: 'hero' })
  const title = `${t('titleStart')} ${t('titleAccent')}`
  const eyebrow = t('eyebrow')
  const [display, body] = await Promise.all([
    loadGoogleFont('Unbounded', 600, `${title}Oselia Studio`),
    loadGoogleFont('Manrope', 600, eyebrow),
  ])

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#faf7f2',
        color: '#1d1d1b',
        padding: 72,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 72,
          top: 72,
          bottom: 0,
          width: 360,
          borderTopLeftRadius: 180,
          borderTopRightRadius: 180,
          background: '#c4622d',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 162,
          bottom: 0,
          width: 180,
          height: 220,
          borderTopLeftRadius: 90,
          borderTopRightRadius: 90,
          background: '#faf7f2',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', width: 640 }}>
        <div style={{ fontFamily: 'Unbounded', fontSize: 34 }}>Oselia Studio</div>
        <div style={{ fontFamily: 'Manrope', fontSize: 26, color: '#9a4518', marginTop: 'auto' }}>
          {eyebrow}
        </div>
        <div style={{ fontFamily: 'Unbounded', fontSize: 62, lineHeight: 1.08, marginTop: 20 }}>
          {title}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Unbounded', data: display, weight: 600 },
        { name: 'Manrope', data: body, weight: 600 },
      ],
    },
  )
}
