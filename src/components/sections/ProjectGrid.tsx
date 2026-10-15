'use client'

import * as m from 'motion/react-m'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState, type CSSProperties } from 'react'

import { InView } from '@/components/motion/InView'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { Project } from '@/payload-types'

type Category = Project['category']

export type ProjectCard = {
  id: number
  slug: string
  title: string
  district: string
  category: Category
  area: number
  weeks: number
  cover: { url: string; alt: string; blurDataURL?: string }
}

const ease = [0.16, 1, 0.3, 1] as const
const categoryOrder: Category[] = ['apartment', 'house', 'kitchen', 'bathroom', 'commercial']

export function ProjectGrid({ projects }: { projects: ProjectCard[] }) {
  const t = useTranslations()
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [filtered, setFiltered] = useState(false)

  const categories = categoryOrder.filter((category) =>
    projects.some((project) => project.category === category),
  )
  const visible =
    filter === 'all' ? projects : projects.filter((project) => project.category === filter)

  return (
    <>
      <div role="group" aria-label={t('projects.filter')} className="mt-10 flex flex-wrap gap-2">
        {(['all', ...categories] as const).map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={filter === category}
            onClick={() => {
              setFilter(category)
              setFiltered(true)
            }}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
              filter === category
                ? 'border-ink bg-ink text-sand-50'
                : 'border-ink/15 text-ink/75 hover:border-ink/40 hover:text-ink',
            )}
          >
            {category === 'all' ? t('projects.all') : t(`projects.categories.${category}`)}
          </button>
        ))}
      </div>

      <m.ul layout className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, index) => (
          <m.li
            key={project.id}
            layout
            initial={filtered ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <Link
              href={`/projects/${project.slug}`}
              data-cursor={t('cursor.view')}
              className="group block rounded-card"
            >
              <InView amount={0.2}>
                <div
                  className="reveal-image relative aspect-[4/5] overflow-hidden rounded-card bg-sand-200"
                  style={{ '--d': `${(index % 3) * 100}ms` } as CSSProperties}
                >
                  <Image
                    src={project.cover.url}
                    alt={project.cover.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    placeholder={project.cover.blurDataURL ? 'blur' : 'empty'}
                    blurDataURL={project.cover.blurDataURL}
                    className="object-cover transition-transform duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-105"
                  />
                </div>
              </InView>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold">{project.title}</h3>
                  <p className="mt-1 text-muted">{project.district}</p>
                </div>
                <p className="shrink-0 text-right text-sm font-semibold text-ink/70">
                  {t('projects.area', { area: project.area })}
                  <br />
                  {t('projects.weeks', { weeks: project.weeks })}
                </p>
              </div>
            </Link>
          </m.li>
        ))}
      </m.ul>
    </>
  )
}
