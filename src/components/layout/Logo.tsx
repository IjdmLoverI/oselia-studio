import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8 shrink-0">
        <path d="M4 30V15C4 8.4 9.4 3 16 3s12 5.4 12 12v15H4Z" className="fill-accent-500" />
        <path d="M11 30v-9a5 5 0 0 1 10 0v9h-10Z" className="fill-sand-50" />
      </svg>
      <span className="font-display text-lg leading-none font-semibold tracking-tight">
        Oselia
        <span className="ml-1.5 align-top text-[0.6rem] font-medium tracking-[0.2em] text-muted uppercase">
          Studio
        </span>
      </span>
    </span>
  )
}
