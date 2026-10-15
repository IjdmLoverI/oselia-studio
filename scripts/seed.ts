import config from '@payload-config'
import path from 'path'
import { getPayload, type Payload } from 'payload'
import { fileURLToPath } from 'url'

import {
  assistant,
  faqs,
  images,
  pricing,
  projects,
  services,
  siteSettings,
  testimonials,
} from './seed/content'
import { paragraphs } from './seed/lexical'

const mediaDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'seed/media')
const seedContext = () => ({ disableRevalidate: true })

async function seedAdmin(payload: Payload) {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) return

  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } } })
  if (existing.totalDocs > 0) return

  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Admin' },
    context: seedContext(),
  })
  console.log(`Created admin ${email}`)
}

async function isStoredFileMissing(url: string | null | undefined) {
  if (!url?.startsWith('http')) return false
  const response = await fetch(url, { method: 'HEAD' })
  return !response.ok
}

async function seedMedia(payload: Payload) {
  const ids = new Map<string, number>()

  for (const image of images) {
    const filename = `${image.file}.webp`
    const filePath = path.join(mediaDir, filename)
    const found = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    })
    const credit = { author: image.author, url: image.photo }
    const existing = found.docs[0]

    const doc =
      existing ??
      (await payload.create({
        collection: 'media',
        locale: 'uk',
        data: { alt: image.alt.uk, credit },
        filePath,
        context: seedContext(),
      }))

    if (existing && (await isStoredFileMissing(existing.url))) {
      await payload.update({
        collection: 'media',
        id: existing.id,
        data: {},
        filePath,
        overwriteExistingFiles: true,
        context: seedContext(),
      })
      console.log(`Re-uploaded ${filename}`)
    }

    await payload.update({
      collection: 'media',
      id: doc.id,
      locale: 'uk',
      data: { alt: image.alt.uk, credit },
      context: seedContext(),
    })
    await payload.update({
      collection: 'media',
      id: doc.id,
      locale: 'en',
      data: { alt: image.alt.en },
      context: seedContext(),
    })
    ids.set(image.file, doc.id)
  }

  return ids
}

async function seedServices(payload: Payload, media: Map<string, number>) {
  const ids = new Map<string, number>()

  for (const [order, service] of services.entries()) {
    const found = await payload.find({
      collection: 'services',
      where: { slug: { equals: service.slug } },
      limit: 1,
      depth: 0,
    })
    const data = {
      slug: service.slug,
      generateSlug: false,
      image: media.get(service.image)!,
      priceFrom: service.priceFrom,
      order,
      title: service.title.uk,
      summary: service.summary.uk,
    }

    const doc = found.docs[0]
      ? await payload.update({
          collection: 'services',
          id: found.docs[0].id,
          locale: 'uk',
          data,
          context: seedContext(),
        })
      : await payload.create({ collection: 'services', locale: 'uk', data, context: seedContext() })

    await payload.update({
      collection: 'services',
      id: doc.id,
      locale: 'en',
      data: { title: service.title.en, summary: service.summary.en },
      context: seedContext(),
    })
    ids.set(service.slug, doc.id)
  }

  return ids
}

async function seedProjects(
  payload: Payload,
  media: Map<string, number>,
  serviceIds: Map<string, number>,
) {
  const ids = new Map<string, number>()

  for (const project of projects) {
    const found = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
      depth: 0,
      draft: true,
    })
    const data = {
      slug: project.slug,
      generateSlug: false,
      category: project.category,
      cover: media.get(project.cover)!,
      sketch: media.get(project.sketch)!,
      gallery: project.gallery.map((file) => media.get(file)!),
      area: project.area,
      durationWeeks: project.durationWeeks,
      budgetFrom: project.budgetFrom,
      year: project.year,
      featured: project.featured,
      services: project.services.map((slug) => serviceIds.get(slug)!),
      title: project.title.uk,
      district: project.district.uk,
      summary: project.summary.uk,
      body: paragraphs(project.body.uk),
      _status: 'published' as const,
    }

    const doc = found.docs[0]
      ? await payload.update({
          collection: 'projects',
          id: found.docs[0].id,
          locale: 'uk',
          data,
          context: seedContext(),
        })
      : await payload.create({ collection: 'projects', locale: 'uk', data, context: seedContext() })

    await payload.update({
      collection: 'projects',
      id: doc.id,
      locale: 'en',
      data: {
        title: project.title.en,
        district: project.district.en,
        summary: project.summary.en,
        body: paragraphs(project.body.en),
        _status: 'published',
      },
      context: seedContext(),
    })
    ids.set(project.slug, doc.id)
  }

  return ids
}

async function seedTestimonials(payload: Payload, projectIds: Map<string, number>) {
  for (const testimonial of testimonials) {
    const project = projectIds.get(testimonial.project)!
    const found = await payload.find({
      collection: 'testimonials',
      where: { project: { equals: project } },
      limit: 1,
      depth: 0,
    })
    const data = {
      project,
      rating: testimonial.rating,
      author: testimonial.author.uk,
      text: testimonial.text.uk,
    }

    const doc = found.docs[0]
      ? await payload.update({
          collection: 'testimonials',
          id: found.docs[0].id,
          locale: 'uk',
          data,
          context: seedContext(),
        })
      : await payload.create({
          collection: 'testimonials',
          locale: 'uk',
          data,
          context: seedContext(),
        })

    await payload.update({
      collection: 'testimonials',
      id: doc.id,
      locale: 'en',
      data: { author: testimonial.author.en, text: testimonial.text.en },
      context: seedContext(),
    })
  }
}

async function seedFaqs(payload: Payload) {
  for (const [order, faq] of faqs.entries()) {
    const found = await payload.find({
      collection: 'faqs',
      where: { question: { equals: faq.question.uk } },
      locale: 'uk',
      limit: 1,
      depth: 0,
    })
    const data = { order, question: faq.question.uk, answer: faq.answer.uk }

    const doc = found.docs[0]
      ? await payload.update({
          collection: 'faqs',
          id: found.docs[0].id,
          locale: 'uk',
          data,
          context: seedContext(),
        })
      : await payload.create({ collection: 'faqs', locale: 'uk', data, context: seedContext() })

    await payload.update({
      collection: 'faqs',
      id: doc.id,
      locale: 'en',
      data: { question: faq.question.en, answer: faq.answer.en },
      context: seedContext(),
    })
  }
}

async function seedGlobals(payload: Payload) {
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'uk',
    data: {
      phone: siteSettings.phone,
      email: siteSettings.email,
      address: siteSettings.address.uk,
      hours: siteSettings.hours.uk,
      stats: siteSettings.stats,
    },
    context: seedContext(),
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: { address: siteSettings.address.en, hours: siteSettings.hours.en },
    context: seedContext(),
  })

  const saved = await payload.updateGlobal({
    slug: 'pricing',
    locale: 'uk',
    data: {
      types: pricing.types.map((type) => ({
        key: type.key,
        pricePerSqm: type.pricePerSqm,
        description: type.description.uk,
      })),
      extras: pricing.extras.map((extra) => ({
        key: extra.key,
        price: extra.price,
        perSqm: extra.perSqm,
        label: extra.label.uk,
      })),
    },
    context: seedContext(),
  })
  await payload.updateGlobal({
    slug: 'pricing',
    locale: 'en',
    data: {
      types: saved.types.map((row, index) => ({
        ...row,
        description: pricing.types[index].description.en,
      })),
      extras: (saved.extras ?? []).map((row, index) => ({
        ...row,
        label: pricing.extras[index].label.en,
      })),
    },
    context: seedContext(),
  })

  for (const locale of ['uk', 'en'] as const) {
    await payload.updateGlobal({
      slug: 'assistant-settings',
      locale,
      data: { greeting: assistant.greeting[locale], visitInfo: assistant.visitInfo[locale] },
      context: seedContext(),
    })
  }
}

const payload = await getPayload({ config })

await seedAdmin(payload)
const media = await seedMedia(payload)
const serviceIds = await seedServices(payload, media)
const projectIds = await seedProjects(payload, media, serviceIds)
await seedTestimonials(payload, projectIds)
await seedFaqs(payload)
await seedGlobals(payload)

console.log(
  `Seeded ${media.size} images, ${serviceIds.size} services, ${projectIds.size} projects, ` +
    `${testimonials.length} testimonials and ${faqs.length} questions.`,
)
process.exit(0)
