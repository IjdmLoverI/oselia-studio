'use client'

import { useSpring, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { useFormatter } from 'next-intl'
import { useEffect } from 'react'

export function AnimatedNumber({ value }: { value: number }) {
  const format = useFormatter()
  const spring = useSpring(value, { stiffness: 90, damping: 22 })
  const text = useTransform(spring, (latest) => format.number(Math.round(latest / 1000) * 1000))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <m.span className="tabular-nums">{text}</m.span>
}
