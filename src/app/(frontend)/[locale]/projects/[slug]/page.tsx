import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { CSSProperties } from 'react'

import { SectionLink } from '@/components/layout/SectionLink'
import { InView } from '@/components/motion/InView'
import { RevealWords } from '@/components/motion/RevealWords'
import { BeforeAfter } from '@/components/sections/BeforeAfter'
import { buttonStyles } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { Container } from '@/components/ui/Container'
import { resolveLocale } from '@/i18n/locale'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { getProject, getProjects, getTestimonials } from '@/lib/content'
import { asMedia } from '@/lib/media'

type Props = PageProps<'/[locale]/projects/[slug]'>

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const projects = await getProjects(resolveLocale(params.locale))
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: value, slug } = await params
  const locale = resolveLocale(value)
  const project = await getProject(slug, locale)
  if (!project) return {}

  const cover = asMedia(project.cover)
  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: Object.fromEntries(
        routing.locales.map((code) => [code, `/${code}/projects/${slug}`]),
      ),
    },
    openGraph: cover?.url ? { images: [{ url: cover.url, alt: cover.alt }] } : undefined,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { locale: value, slug } = await params
  const locale = resolveLocale(value)
  setRequestLocale(locale)

  const [t, project, projects, testimonials] = await Promise.all([
    getTranslations({ locale }),
    getProject(slug, locale),
    getProjects(locale),
    getTestimonials(locale),
  ])
  if (!project) notFound()

  const cover = asMedia(project.cover)
  const sketch = asMedia(project.sketch)
  const gallery = (project.gallery ?? []).map(asMedia).filter((image) => image !== null)
  const services = (project.services ?? []).filter((service) => typeof service === 'object')
  const testimonial = testimonials.find((item) =>
    typeof item.project === 'object'
      ? item.project?.id === project.id
      : item.project === project.id,
  )
  const index = projects.findIndex((item) => item.id === project.id)
  const next = projects[(index + 1) % projects.length]
  const nextCover = next && next.id !== project.id ? asMedia(next.cover) : null

  const facts = [
    { label: t('project.area'), value: t('projects.area', { area: project.area }) },
    { label: t('project.duration'), value: t('projects.weeks', { weeks: project.durationWeeks }) },
    project.budgetFrom
      ? {
          label: t('project.budget'),
          value: t('project.budgetValue', { value: project.budgetFrom }),
        }
      : null,
    { label: t('project.year'), value: String(project.year) },
  ].filter((fact) => fact !== null)

  return (
    <article className="pt-28 pb-24 sm:pt-36">
      <Container>
        <Link
          href={{ pathname: '/', hash: 'projects' }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('project.back')}
        </Link>

        <InView className="mt-8 max-w-4xl">
          <p className="reveal-fade text-sm font-semibold tracking-wide text-accent-700">
            {project.district}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
            <RevealWords text={project.title} />
          </h1>
          <p
            className="reveal-fade mt-6 max-w-2xl text-lg leading-relaxed text-muted"
            style={{ '--d': '200ms' } as CSSProperties}
          >
            {project.summary}
          </p>
        </InView>

        <dl className="mt-12 grid grid-cols-2 gap-6 border-y border-ink/10 py-8 sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1">
              <dt className="order-2 text-sm text-muted">{fact.label}</dt>
              <dd className="order-1 font-display text-2xl font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>

        {cover && (
          <section aria-label={t('project.compare')} className="mt-12">
            {sketch ? (
              <BeforeAfter
                sketch={{ url: sketch.url!, alt: sketch.alt }}
                result={{
                  url: cover.url!,
                  alt: cover.alt,
                  blurDataURL: cover.blurDataURL ?? undefined,
                }}
                label={t('project.compareLabel')}
                sketchLabel={t('project.sketch')}
                resultLabel={t('project.result')}
              />
            ) : (
              <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem]">
                <CmsImage media={cover} fill priority sizes="100vw" className="object-cover" />
              </div>
            )}
          </section>
        )}

        <div className="mt-20 grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-semibold">{t('project.story')}</h2>
            {services.length > 0 && (
              <>
                <p className="mt-8 text-sm font-semibold tracking-wide text-muted uppercase">
                  {t('project.work')}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {services.map((service) => (
                    <li
                      key={service.id}
                      className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-semibold"
                    >
                      {service.title}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div>
            {project.body && (
              <RichText
                data={project.body}
                className="space-y-5 text-lg leading-relaxed text-ink/85"
              />
            )}
            {testimonial && (
              <figure className="mt-10 rounded-card bg-sand-100 p-7">
                <blockquote className="font-display text-xl leading-snug">
                  “{testimonial.text}”
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-muted">
                  {testimonial.author}
                </figcaption>
              </figure>
            )}
          </div>
        </div>

        {gallery.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-semibold">{t('project.gallery')}</h2>
            <InView amount={0.1} className="mt-8 grid gap-5 sm:grid-cols-2">
              {gallery.map((image, position) => (
                <div
                  key={image.id}
                  className={`reveal-image relative overflow-hidden rounded-card ${
                    gallery.length % 2 === 1 && position === 0
                      ? 'aspect-[16/9] sm:col-span-2'
                      : 'aspect-[4/3]'
                  }`}
                  style={{ '--d': `${position * 120}ms` } as CSSProperties}
                >
                  <CmsImage
                    media={image}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </InView>
          </section>
        )}

        <section className="mt-24 flex flex-col items-start justify-between gap-6 rounded-card bg-ink p-8 text-sand-50 sm:p-12 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold">{t('project.ctaTitle')}</h2>
            <p className="mt-3 text-sand-200">{t('project.ctaText')}</p>
          </div>
          <SectionLink section="pricing" className={buttonStyles({ size: 'lg' })}>
            {t('project.ctaButton')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </SectionLink>
        </section>

        {next && nextCover && (
          <Link
            href={`/projects/${next.slug}`}
            data-cursor={t('cursor.view')}
            className="group mt-24 block"
          >
            <p className="text-sm font-semibold tracking-wide text-muted uppercase">
              {t('project.next')}
            </p>
            <div className="mt-4 flex items-end justify-between gap-6">
              <p className="font-display text-3xl font-semibold transition-colors group-hover:text-accent-600 sm:text-5xl">
                {next.title}
              </p>
              <ArrowRight
                className="size-8 shrink-0 transition-transform duration-300 group-hover:translate-x-2"
                aria-hidden="true"
              />
            </div>
            <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-card">
              <CmsImage
                media={nextCover}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-105"
              />
            </div>
          </Link>
        )}
      </Container>
    </article>
  )
}
