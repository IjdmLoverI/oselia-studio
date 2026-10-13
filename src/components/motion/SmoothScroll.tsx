'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

import { useFinePointer } from '@/lib/use-media-query'

export function SmoothScroll() {
  const enabled = useFinePointer()

  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -88 } })
    return () => lenis.destroy()
  }, [enabled])

  return null
}
