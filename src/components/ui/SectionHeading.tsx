import type { CSSProperties } from 'react'

import { InView } from '@/components/motion/InView'
import { RevealWords } from '@/components/motion/RevealWords'
import { cn } from '@/lib/utils'

type Props = {
  eyebrow: string
  title: string
  lead?: string
  align?: 'start' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'start',
  tone = 'light',
  className,
}: Props) {
  return (
    <InView
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        tone === 'dark' && 'text-sand-50',
        className,
      )}
    >
      <p
        className={cn(
          'reveal-fade mb-4 inline-flex items-center gap-2 text-sm font-semibold tracking-wide',
          tone === 'dark' ? 'text-sand-300' : 'text-accent-700',
        )}
      >
        <span className="h-px w-8 bg-current" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">
        <RevealWords text={title} />
      </h2>
      {lead && (
        <p
          className={cn(
            'reveal-fade mt-5 text-lg leading-relaxed',
            tone === 'dark' ? 'text-sand-200' : 'text-muted',
          )}
          style={{ '--d': '200ms' } as CSSProperties}
        >
          {lead}
        </p>
      )}
    </InView>
  )
}
