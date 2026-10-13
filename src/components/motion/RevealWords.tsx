import { Fragment, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

export function RevealWords({
  text,
  offset = 0,
  className,
}: {
  text: string
  offset?: number
  className?: string
}) {
  return text.split(' ').map((word, index) => (
    <Fragment key={index}>
      <span className="reveal-mask">
        <span
          className={cn('reveal-word', className)}
          style={{ '--i': offset + index } as CSSProperties}
        >
          {word}
        </span>
      </span>{' '}
    </Fragment>
  ))
}

export const wordCount = (text: string) => text.split(' ').length
