'use client'

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { useRef } from 'react'

const wrap = (min: number, max: number, value: number) => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

export function Marquee({ items }: { items: string[] }) {
  const reducedMotion = useReducedMotion()
  const offset = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(offset, (value) => `${wrap(-50, 0, value)}%`)
  const direction = useRef(-1)

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return
    const factor = boost.get()
    if (factor < 0) direction.current = 1
    else if (factor > 0) direction.current = -1
    const step = direction.current * 1.6 * (delta / 1000)
    offset.set(offset.get() + step + step * Math.abs(factor))
  })

  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-ink/10 py-8 sm:py-10">
      <motion.div style={{ x }} className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item, index) => (
              <span
                key={item}
                className="flex items-center gap-8 pr-8 font-display text-5xl font-semibold tracking-tight whitespace-nowrap sm:text-7xl"
              >
                <span className={index % 2 ? 'text-accent-600' : 'text-ink'}>{item}</span>
                <svg viewBox="0 0 32 32" className="size-8 shrink-0 sm:size-10">
                  <path
                    d="M4 30V15C4 8.4 9.4 3 16 3s12 5.4 12 12v15H4Z"
                    className="fill-accent-500"
                  />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
