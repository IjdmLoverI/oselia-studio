import 'server-only'

import { APICallError, stepCountIs, streamText } from 'ai'

import type { Locale } from '@/i18n/routing'

import {
  CLIENT_WINDOW_MS,
  countUserMessages,
  limitReached,
  recentHistory,
  type StoredMessage,
} from './guard'
import { assistantModel } from './model'
import { buildInstructions } from './prompt'
import { cannedReply } from './replies'
import { fromStudioTime, toStudioTime } from './slots'
import {
  activeBooking,
  appendTurn,
  createBooking,
  loadKnowledge,
  loadSettings,
  openConversation,
  readPending,
  recentConversations,
  takenVisits,
  writePending,
  type ConversationKey,
} from './store'
import { createTools, describeSlot } from './tools'

export type Turn = ConversationKey & { locale: Locale; text: string; ipHash?: string }

const MAX_STEPS = 5
const MAX_OUTPUT_TOKENS = 700

const startOfStudioDay = (now: Date) => fromStudioTime(`${toStudioTime(now).slice(0, 10)}T00:00`)!

const isRateLimit = (error: unknown) => APICallError.isInstance(error) && error.statusCode === 429

export async function* reply(turn: Turn): AsyncGenerator<string> {
  const settings = await loadSettings(turn.locale)
  const { knowledge, rates, phone } = await loadKnowledge(turn.locale, settings.visitInfo)
  const configured = assistantModel()

  if (!configured || !settings.enabled) {
    yield cannedReply('unavailable', turn.locale, phone)
    return
  }

  const now = new Date()
  const [site, own] = await Promise.all([
    recentConversations(startOfStudioDay(now)),
    recentConversations(new Date(now.getTime() - CLIENT_WINDOW_MS), turn),
  ])
  const limit = limitReached(
    {
      site: countUserMessages(site, startOfStudioDay(now)),
      client: countUserMessages(own, new Date(now.getTime() - CLIENT_WINDOW_MS)),
    },
    settings.limits,
  )
  if (limit) {
    yield cannedReply(limit === 'site' ? 'busy' : 'slowDown', turn.locale, phone)
    return
  }

  const conversation = await openConversation(turn, {
    locale: turn.locale,
    title: turn.text,
    ipHash: turn.ipHash,
  })
  const history = (conversation.messages ?? []) as StoredMessage[]
  const userMessage: StoredMessage = { role: 'user', text: turn.text, at: now.toISOString() }

  const [booked, pending] = await Promise.all([
    activeBooking(conversation.id),
    readPending(conversation.id),
  ])
  const state = {
    booked: booked ? describeSlot(booked, turn.locale) : undefined,
    pending: pending
      ? `${describeSlot(pending.slot, turn.locale)}; ${pending.name}, ${pending.phone}, ${pending.address}`
      : undefined,
  }

  const tools = createTools({
    locale: turn.locale,
    turn: userMessage.at,
    now: () => new Date(),
    rates,
    schedule: settings.schedule,
    takenVisits: () => takenVisits(new Date(Date.now() - settings.schedule.slotMinutes * 60_000)),
    existingBooking: () => activeBooking(conversation.id),
    pendingBooking: () => readPending(conversation.id),
    savePending: (next) => writePending(conversation.id, next),
    createBooking: (request) =>
      createBooking(request, {
        conversationId: conversation.id,
        channel: turn.channel,
        locale: turn.locale,
      }),
    log: (message) => console.warn(message),
  })

  const result = streamText({
    model: configured.model,
    providerOptions: configured.providerOptions,
    instructions: buildInstructions(knowledge, { locale: turn.locale, now, state }),
    messages: [...recentHistory(history), { role: 'user', content: turn.text }],
    tools,
    stopWhen: stepCountIs(MAX_STEPS),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    maxRetries: 1,
  })

  let answer = ''
  let failure: unknown = null
  let tokens = 0

  try {
    for await (const part of result.stream) {
      if (part.type === 'text-delta') {
        const text = part.text.replace(/\u00ad/g, '')
        answer += text
        yield text
      } else if (part.type === 'tool-error') {
        const reason = part.error instanceof Error ? part.error.name : 'unknown error'
        console.warn(`Tool ${part.toolName} failed: ${reason}`)
      } else if (part.type === 'error') {
        failure = part.error
        break
      }
    }

    if (failure || !answer.trim()) {
      if (failure) console.error('Assistant reply failed', failure)
      const fallback = cannedReply(isRateLimit(failure) ? 'busy' : 'failed', turn.locale, phone)
      const separator = answer.trim() ? '\n\n' : ''
      answer += separator + fallback
      yield separator + fallback
    }

    tokens = await Promise.resolve(result.totalUsage).then(
      (usage) => usage.totalTokens ?? 0,
      () => 0,
    )
  } finally {
    await appendTurn(conversation.id, {
      messages: [
        userMessage,
        { role: 'assistant', text: answer.trim() || '…', at: new Date().toISOString() },
      ],
      tokens,
    }).catch((error) => console.error('Could not save the conversation', error))
  }
}
