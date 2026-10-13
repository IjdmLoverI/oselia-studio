'use client'

import { MoveHorizontal } from 'lucide-react'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react'
import Image from 'next/image'
import { useRef, useState } from 'react'

import photo from '@/assets/showcase-photo.webp'
import sketch from '@/assets/showcase-sketch.webp'
import { InView } from '@/components/motion/InView'
import { RevealWords } from '@/components/motion/RevealWords'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

type Step = { title: string; text: string }

type Props = {
  eyebrow: string
  title: string
  sketchLabel: string
  resultLabel: string
  sketchAlt: string
  photoAlt: string
  steps: Step[]
}

export function SketchToReality({
  eyebrow,
  title,
  sketchLabel,
  resultLabel,
  sketchAlt,
  photoAlt,
  steps,
}: Props) {
  const section = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const revealed = useTransform(scrollYProgress, [0.12, 0.88], [0, 100])
  const hidden = useTransform(revealed, (value) => 100 - value)
  const clipPath = useMotionTemplate`inset(0 ${hidden}% 0 0)`
  const handle = useMotionTemplate`${revealed}%`
  const handleOpacity = useTransform(revealed, [0, 4, 96, 100], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.9, 1])
  const progress = useTransform(scrollYProgress, [0.05, 0.95], [0, 1])
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length))))
  })

  return (
    <section ref={section} id="process" className="relative h-[300vh] bg-sand-100">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden py-20">
        <Container className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <InView>
              <p className="reveal-fade mb-4 text-sm font-semibold tracking-wide text-accent-700">
                {eyebrow}
              </p>
              <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">
                <RevealWords text={title} />
              </h2>
            </InView>

            <ol className="mt-8 hidden space-y-6 lg:block">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className={cn(
                    'border-l-2 pl-5 transition-all duration-500',
                    index === active ? 'border-accent-500 opacity-100' : 'border-ink/10 opacity-40',
                  )}
                >
                  <p className="font-display text-sm font-semibold text-accent-700">0{index + 1}</p>
                  <p className="mt-1 text-lg font-semibold">{step.title}</p>
                  <p className="mt-1 text-muted">{step.text}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6 lg:hidden" aria-live="polite">
              <p className="font-display text-sm font-semibold text-accent-700">0{active + 1}</p>
              <p className="mt-1 text-lg font-semibold">{steps[active].title}</p>
              <p className="mt-1 text-muted">{steps[active].text}</p>
            </div>
          </div>

          <div>
            <motion.div
              style={{ scale }}
              className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-card"
            >
              <Image
                src={sketch}
                alt={sketchAlt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
              <motion.div style={{ clipPath }} className="absolute inset-0">
                <Image
                  src={photo}
                  alt={photoAlt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                style={{ left: handle, opacity: handleOpacity }}
                className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90"
              >
                <span className="absolute top-1/2 left-1/2 grid size-11 -translate-1/2 place-items-center rounded-full bg-white text-ink shadow-card">
                  <MoveHorizontal className="size-5" aria-hidden="true" />
                </span>
              </motion.div>
              <span className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold backdrop-blur">
                {resultLabel}
              </span>
              <span className="absolute top-4 right-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold backdrop-blur">
                {sketchLabel}
              </span>
            </motion.div>
            <div className="mt-5 h-1 overflow-hidden rounded-full bg-ink/10">
              <motion.div
                style={{ scaleX: progress }}
                className="h-full origin-left rounded-full bg-accent-500"
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
