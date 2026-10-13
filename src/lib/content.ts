import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Locale } from '@/i18n/routing'

const client = () => getPayload({ config })

export const getServices = cache(async (locale: Locale) => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'services',
    locale,
    sort: 'order',
    limit: 50,
    depth: 1,
  })
  return docs
})

export const getProjects = cache(async (locale: Locale) => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'projects',
    locale,
    where: { _status: { equals: 'published' } },
    sort: ['-featured', '-year'],
    limit: 100,
    depth: 1,
  })
  return docs
})

export const getProject = cache(async (slug: string, locale: Locale) => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'projects',
    locale,
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

export const getTestimonials = cache(async (locale: Locale) => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'testimonials',
    locale,
    limit: 50,
    depth: 1,
  })
  return docs
})

export const getFaqs = cache(async (locale: Locale) => {
  const payload = await client()
  const { docs } = await payload.find({ collection: 'faqs', locale, sort: 'order', limit: 50 })
  return docs
})

export const getSiteSettings = cache(async (locale: Locale) => {
  const payload = await client()
  return payload.findGlobal({ slug: 'site-settings', locale })
})

export const getPricing = cache(async (locale: Locale) => {
  const payload = await client()
  return payload.findGlobal({ slug: 'pricing', locale })
})

export const getMediaCredits = cache(async () => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'media',
    where: { 'credit.author': { exists: true } },
    limit: 200,
    depth: 0,
    select: { credit: true },
  })
  return docs
})
