'use client'

import { AnimatePresence, useMotionValue, useSpring } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'

import { useFinePointer } from '@/lib/use-media-query'

const interactive = 'a, button, [role="button"], input, textarea, select, label, summary'

export function Cursor() {
  const enabled = useFinePointer()
  const [label, setLabel] = useState<string | null>(null)
  const [active, setActive] = useState(false)
  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)
  const x = useSpring(pointerX, { stiffness: 450, damping: 40, mass: 0.5 })
  const y = useSpring(pointerY, { stiffness: 450, damping: 40, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return

    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
    }
    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      setLabel(target?.closest('[data-cursor]')?.getAttribute('data-cursor') ?? null)
      setActive(Boolean(target?.closest(interactive)))
    }
    const onLeave = () => {
      pointerX.set(-100)
      pointerY.set(-100)
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, pointerX, pointerY])

  if (!enabled) return null

  return (
    <m.div
      aria-hidden="true"
      style={{ x, y }}
      className="pointer-events-none fixed top-0 left-0 z-[70]"
    >
      <m.span
        animate={{ scale: label ? 0 : active ? 1.6 : 1, opacity: label ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="absolute -top-4.5 -left-4.5 size-9 rounded-full border border-ink/50"
      />
      <AnimatePresence>
        {label && (
          <m.span
            key="label"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="absolute -top-12 -left-12 grid size-24 place-items-center rounded-full bg-accent-600 text-xs font-semibold tracking-wide text-white uppercase"
          >
            {label}
          </m.span>
        )}
      </AnimatePresence>
    </m.div>
  )
}
