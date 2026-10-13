import { useTranslations } from 'next-intl'

import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { asMedia } from '@/lib/media'
import type { Project } from '@/payload-types'

import { ProjectGrid, type ProjectCard } from './ProjectGrid'

export function Projects({ projects }: { projects: Project[] }) {
  const t = useTranslations('projects')

  const cards: ProjectCard[] = projects.flatMap((project) => {
    const cover = asMedia(project.cover)
    if (!cover) return []
    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      district: project.district,
      category: project.category,
      area: project.area,
      weeks: project.durationWeeks,
      cover: {
        url: cover.url!,
        alt: cover.alt,
        blurDataURL: cover.blurDataURL ?? undefined,
      },
    }
  })

  return (
    <section id="projects" className="py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <ProjectGrid projects={cards} />
      </Container>
    </section>
  )
}
