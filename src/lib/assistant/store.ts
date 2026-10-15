import 'server-only'

import config from '@payload-config'
import { getPayload, ValidationError, type Where } from 'payload'

import { env } from '@/env'
import { limitDefaults, scheduleDefaults } from '@/globals/AssistantSettings'
import type { Locale } from '@/i18n/routing'
import { getFaqs, getPricing, getProjects, getServices, getSiteSettings } from '@/lib/content'
import type { Rates } from '@/lib/pricing'
import { formatBookingMessage, sendToTelegram } from '@/lib/telegram'

import type { StoredMessage } from './guard'
import type { Knowledge } from './prompt'
import { toStudioTime } from './slots'
import type { BookingRequest } from './tools'

export type Channel = 'web' | 'telegram'

export type ConversationKey = { channel: Channel; externalId: string }

const client = () => getPayload({ config })

export async function loadSettings(locale: Locale) {
  const payload = await client()
  const doc = await payload.findGlobal({ slug: 'assistant-settings', locale, depth: 0 })
  const schedule = { ...scheduleDefaults, ...doc.schedule }

  return {
    enabled: doc.enabled ?? true,
    greeting: doc.greeting ?? '',
    visitInfo: doc.visitInfo ?? '',
    schedule: {
      ...schedule,
      workDays: schedule.workDays?.length ? schedule.workDays : scheduleDefaults.workDays,
    },
    limits: { ...limitDefaults, ...doc.limits },
  }
}

export async function loadKnowledge(locale: Locale, visitInfo: string) {
  const [site, pricing, services, projects, faqs] = await Promise.all([
    getSiteSettings(locale),
    getPricing(locale),
    getServices(locale),
    getProjects(locale),
    getFaqs(locale),
  ])

  const rates: Rates = {
    types: pricing.types.map(({ key, pricePerSqm }) => ({ key, pricePerSqm })),
    extras: (pricing.extras ?? []).map(({ key, price, perSqm }) => ({ key, price, perSqm })),
  }

  const knowledge: Knowledge = {
    site: {
      phone: site.phone,
      email: site.email,
      address: site.address,
      hours: site.hours,
      stats: site.stats,
    },
    visitInfo,
    services: services.map(({ title, summary, priceFrom }) => ({ title, summary, priceFrom })),
    rates: pricing.types.map(({ key, pricePerSqm, description }) => ({
      key,
      pricePerSqm,
      description,
    })),
    extras: (pricing.extras ?? []).map(({ key, label, price, perSqm }) => ({
      key,
      label,
      price,
      perSqm,
    })),
    projects: projects.map((project) => ({
      title: project.title,
      category: project.category,
      area: project.area,
      durationWeeks: project.durationWeeks,
      budgetFrom: project.budgetFrom,
      year: project.year,
      district: project.district,
    })),
    faqs: faqs.map(({ question, answer }) => ({ question, answer })),
  }

  return { knowledge, rates, phone: site.phone }
}

export async function openConversation(
  key: ConversationKey,
  { locale, title, ipHash }: { locale: Locale; title: string; ipHash?: string },
) {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'conversations',
    where: {
      and: [{ channel: { equals: key.channel } }, { externalId: { equals: key.externalId } }],
    },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) return docs[0]

  return payload.create({
    collection: 'conversations',
    data: { ...key, locale, title: title.slice(0, 120), ipHash, messages: [], tokens: 0 },
  })
}

export async function appendTurn(
  conversationId: number,
  turn: { messages: StoredMessage[]; tokens: number },
) {
  const payload = await client()
  const current = await payload.findByID({
    collection: 'conversations',
    id: conversationId,
    depth: 0,
  })
  const history = (current.messages ?? []).map(({ role, text, at }) => ({ role, text, at }))

  await payload.update({
    collection: 'conversations',
    id: conversationId,
    data: {
      messages: [...history, ...turn.messages],
      lastMessageAt: turn.messages.at(-1)?.at ?? new Date().toISOString(),
      tokens: (current.tokens ?? 0) + turn.tokens,
    },
  })
}

export async function recentConversations(
  since: Date,
  owner?: ConversationKey & { ipHash?: string },
) {
  const payload = await client()
  const ownerFilter: Where[] = owner
    ? [
        owner.ipHash
          ? { ipHash: { equals: owner.ipHash } }
          : {
              and: [
                { channel: { equals: owner.channel } },
                { externalId: { equals: owner.externalId } },
              ],
            },
      ]
    : []

  const { docs } = await payload.find({
    collection: 'conversations',
    where: {
      and: [{ lastMessageAt: { greater_than_equal: since.toISOString() } }, ...ownerFilter],
    },
    pagination: false,
    depth: 0,
    select: { messages: true },
  })
  return docs
}

export async function takenVisits(from: Date) {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'bookings',
    where: { and: [{ slot: { exists: true } }, { visitAt: { greater_than: from.toISOString() } }] },
    pagination: false,
    depth: 0,
    select: { visitAt: true },
  })
  return docs.map((doc) => new Date(doc.visitAt))
}

export async function activeBooking(conversationId: number) {
  const payload = await client()
  const conversation = await payload.findByID({
    collection: 'conversations',
    id: conversationId,
    depth: 1,
    select: { booking: true },
  })
  const booking = conversation.booking
  if (!booking || typeof booking === 'number' || booking.status === 'cancelled') return null
  return toStudioTime(new Date(booking.visitAt))
}

export async function createBooking(
  request: BookingRequest,
  { conversationId, channel, locale }: { conversationId: number; channel: Channel; locale: Locale },
) {
  const payload = await client()
  let bookingId: number

  try {
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        name: request.name,
        phone: request.phone,
        address: request.address,
        visitAt: request.visitAt.toISOString(),
        renovationType: request.renovationType,
        area: request.area,
        notes: request.notes,
        status: 'new',
        source: channel,
        locale,
        conversation: conversationId,
      },
    })
    bookingId = booking.id
  } catch (error) {
    if (error instanceof ValidationError) return 'taken' as const
    if (error instanceof Error && /unique|duplicate/i.test(error.message)) return 'taken' as const
    throw error
  }

  await payload.update({
    collection: 'conversations',
    id: conversationId,
    data: { booking: bookingId },
  })

  try {
    await sendToTelegram(formatBookingMessage({ ...request, source: channel, locale }), {
      token: env.TELEGRAM_BOT_TOKEN,
      chatId: env.TELEGRAM_CHAT_ID,
    })
  } catch (error) {
    console.error('Telegram booking notification failed', error)
  }

  return 'created' as const
}
