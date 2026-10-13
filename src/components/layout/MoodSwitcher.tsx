'use client'

import { useTranslations } from 'next-intl'
import { useSyncExternalStore, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

const moods = [
  { key: 'terracotta', color: '#c4622d' },
  { key: 'olive', color: '#7a7f3c' },
  { key: 'graphite', color: '#4f6d8a' },
] as const

type Mood = (typeof moods)[number]['key']

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mood'] })
  return () => observer.disconnect()
}

const readMood = () => (document.documentElement.dataset.mood as Mood | undefined) ?? 'terracotta'

function applyMood(mood: Mood) {
  const root = document.documentElement
  if (mood === 'terracotta') delete root.dataset.mood
  else root.dataset.mood = mood
  try {
    localStorage.setItem('oselia-mood', mood)
  } catch {}
}

export function MoodSwitcher() {
  const t = useTranslations('mood')
  const current = useSyncExternalStore(subscribe, readMood, () => 'terracotta')

  const select = (mood: Mood) => {
    if (mood === current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (document.startViewTransition && !reduced) {
      document.startViewTransition(() => applyMood(mood))
    } else {
      applyMood(mood)
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={t('label')}
      className="intro-fade fixed bottom-5 left-5 z-30 flex items-center gap-1.5 rounded-full bg-white/80 p-1.5 shadow-card backdrop-blur-md"
      style={{ '--d': '900ms' } as CSSProperties}
    >
      {moods.map((mood) => (
        <button
          key={mood.key}
          type="button"
          role="radio"
          aria-checked={current === mood.key}
          aria-label={t(mood.key)}
          title={t(mood.key)}
          onClick={() => select(mood.key)}
          className={cn(
            'grid size-8 place-items-center rounded-full transition-colors',
            current === mood.key ? 'bg-sand-200' : 'hover:bg-sand-100',
          )}
        >
          <span className="size-4 rounded-full" style={{ backgroundColor: mood.color }} />
        </button>
      ))}
    </div>
  )
}
