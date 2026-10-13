'use client'

import { useInView } from 'motion/react'
import { useRef, type ComponentProps } from 'react'

export function InView({ amount = 0.3, ...props }: ComponentProps<'div'> & { amount?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount })

  return <div ref={ref} data-reveal={inView ? 'visible' : 'hidden'} {...props} />
}
