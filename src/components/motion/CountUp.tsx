'use client'

import { animate, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'

function introDelay() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--intro-delay')
  return Number.parseFloat(value) || 0
}

export function CountUp({
  value,
  suffix = '',
  afterIntro = false,
}: {
  value: number
  suffix?: string
  afterIntro?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    const node = ref.current
    if (!inView || !node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const controls = animate(0, value, {
      duration: 1.6,
      delay: afterIntro ? introDelay() + 0.3 : 0,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = `${Math.round(latest)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, value, suffix, afterIntro])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}
