'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

import { useMediaQuery } from '@/lib/use-media-query'

export function SmoothScroll() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -88 } })
    return () => lenis.destroy()
  }, [reducedMotion])

  return null
}
