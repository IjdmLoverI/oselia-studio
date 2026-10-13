import type { ComponentProps } from 'react'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-accent-600 text-white shadow-sm hover:bg-accent-700',
  dark: 'bg-ink text-sand-50 hover:bg-ink-soft',
  outline: 'border border-ink/15 text-ink hover:border-ink/40 hover:bg-white/70',
}

const sizes = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

type ButtonStyle = {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export function buttonStyles({ variant = 'primary', size = 'md' }: ButtonStyle = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    sizes[size],
  )
}

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & ButtonStyle) {
  return (
    <button type={type} className={cn(buttonStyles({ variant, size }), className)} {...props} />
  )
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonStyle) {
  return <Link className={cn(buttonStyles({ variant, size }), className)} {...props} />
}
