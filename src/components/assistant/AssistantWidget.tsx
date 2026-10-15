'use client'

import { MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useRef, useState, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

const loadPanel = () => import('./AssistantPanel')
const AssistantPanel = dynamic(loadPanel, { ssr: false })

export function AssistantWidget({ greeting }: { greeting: string }) {
  const t = useTranslations('assistant')
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const launcher = useRef<HTMLButtonElement>(null)

  const close = () => {
    setOpen(false)
    launcher.current?.focus()
  }

  return (
    <>
      <div
        className="intro-fade fixed right-5 bottom-5 z-30"
        style={{ '--d': '1100ms' } as CSSProperties}
      >
        <button
          ref={launcher}
          type="button"
          aria-label={t('open')}
          aria-expanded={open}
          aria-controls="assistant-panel"
          tabIndex={open ? -1 : undefined}
          onPointerEnter={() => void loadPanel()}
          onFocus={() => void loadPanel()}
          onClick={() => {
            setMounted(true)
            setOpen(true)
          }}
          className={cn(
            'inline-flex h-12 items-center gap-2 rounded-full bg-ink pr-5 pl-4 text-sm font-semibold text-sand-50 shadow-card transition-[background-color,opacity,transform] duration-300 hover:bg-ink-soft',
            open && 'pointer-events-none scale-90 opacity-0',
          )}
        >
          <MessageCircle aria-hidden className="size-5" />
          {t('launcher')}
        </button>
      </div>
      {mounted && <AssistantPanel open={open} greeting={greeting} onClose={close} />}
    </>
  )
}
