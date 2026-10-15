'use client'

import { ArrowUp, RotateCcw, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

type Message = { role: 'user' | 'assistant'; text: string }
type Session = { id: string; messages: Message[] }

const STORAGE_KEY = 'oselia-assistant'
const MAX_LENGTH = 600

function loadSession(): Session {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null') as Session | null
    if (saved?.id && Array.isArray(saved.messages)) return saved
  } catch {}
  return { id: crypto.randomUUID(), messages: [] }
}

function saveSession(session: Session) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {}
}

const appendToLast = (messages: Message[], text: string) =>
  messages.map((message, index) =>
    index === messages.length - 1 ? { ...message, text: message.text + text } : message,
  )

export default function AssistantPanel({
  open,
  greeting,
  onClose,
}: {
  open: boolean
  greeting: string
  onClose: () => void
}) {
  const t = useTranslations('assistant')
  const locale = useLocale()
  const titleId = useId()
  const [session, setSession] = useState(loadSession)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const input = useRef<HTMLTextAreaElement>(null)
  const list = useRef<HTMLDivElement>(null)

  const { messages } = session

  useEffect(() => saveSession(session), [session])

  useEffect(() => {
    if (open) input.current?.focus()
  }, [open])

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight })
  }, [messages, busy])

  const update = (change: (messages: Message[]) => Message[]) =>
    setSession((current) => ({ ...current, messages: change(current.messages) }))

  async function send(text: string, { retry = false } = {}) {
    const message = text.trim()
    if (!message || busy) return

    setFailed(null)
    setBusy(true)
    setDraft('')
    update((current) => [
      ...(retry ? current : [...current, { role: 'user' as const, text: message }]),
      { role: 'assistant', text: '' },
    ])

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: session.id, locale, message }),
      })
      if (!response.ok || !response.body) throw new Error(`Assistant responded ${response.status}`)

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
      let reply = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        reply += value
        update((current) => appendToLast(current, value))
      }
      if (!reply.trim()) throw new Error('Empty reply')
      setAnnouncement(reply)
    } catch {
      update((current) => (current.at(-1)?.text ? current : current.slice(0, -1)))
      setFailed(message)
    } finally {
      setBusy(false)
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    void send(draft)
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void send(draft)
    }
  }

  function restart() {
    setSession({ id: crypto.randomUUID(), messages: [] })
    setFailed(null)
    setAnnouncement('')
    input.current?.focus()
  }

  const waiting = busy && messages.at(-1)?.text === ''

  return (
    <section
      id="assistant-panel"
      role="dialog"
      aria-labelledby={titleId}
      hidden={!open}
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
      className="fixed inset-x-3 bottom-3 z-40 flex h-[min(36rem,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-card bg-sand-50 shadow-card ring-1 ring-ink/10 motion-safe:animate-[fade-up_0.4s_var(--ease-out-expo)] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[23rem]"
    >
      <header className="flex items-start gap-3 border-b border-ink/10 bg-white/70 px-5 py-4">
        <div className="flex-1">
          <h2 id={titleId} className="font-display text-base font-semibold">
            {t('title')}
          </h2>
          <p className="text-sm text-muted">{t('subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={restart}
          disabled={busy || messages.length === 0}
          aria-label={t('restart')}
          title={t('restart')}
          className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-sand-100 hover:text-ink disabled:opacity-40"
        >
          <RotateCcw aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          title={t('close')}
          className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-sand-100 hover:text-ink"
        >
          <X aria-hidden className="size-5" />
        </button>
      </header>

      <div
        ref={list}
        data-lenis-prevent
        className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-5"
      >
        <Bubble role="assistant" text={greeting} />
        {messages.map((message, index) =>
          message.text ? <Bubble key={index} role={message.role} text={message.text} /> : null,
        )}
        {waiting && (
          <div className="flex gap-1 self-start rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-sm">
            <span className="sr-only">{t('typing')}</span>
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                aria-hidden
                className="size-1.5 rounded-full bg-muted motion-safe:animate-pulse"
                style={{ animationDelay: `${dot * 150}ms` }}
              />
            ))}
          </div>
        )}
        {messages.length === 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {(t.raw('suggestions') as string[]).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void send(suggestion)}
                className="rounded-full border border-ink/15 bg-white/60 px-3.5 py-2 text-left text-sm transition-colors hover:border-accent-600 hover:text-accent-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        {failed && (
          <div role="alert" className="self-start text-sm text-accent-700">
            {t('error')}{' '}
            <button
              type="button"
              onClick={() => void send(failed, { retry: true })}
              className="font-semibold underline underline-offset-4"
            >
              {t('retry')}
            </button>
          </div>
        )}
      </div>

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <form onSubmit={submit} className="border-t border-ink/10 bg-white/70 px-4 pt-3 pb-3">
        <div className="flex items-end gap-2">
          <label htmlFor="assistant-input" className="sr-only">
            {t('placeholder')}
          </label>
          <textarea
            id="assistant-input"
            ref={input}
            rows={1}
            value={draft}
            maxLength={MAX_LENGTH}
            placeholder={t('placeholder')}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            className="[field-sizing:content] max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-sm placeholder:text-muted focus:border-accent-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !draft.trim()}
            aria-label={t('send')}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-600 text-white transition-colors hover:bg-accent-700 disabled:opacity-40"
          >
            <ArrowUp aria-hidden className="size-5" />
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">{t('note')}</p>
      </form>
    </section>
  )
}

function Bubble({ role, text }: Message) {
  return (
    <p
      className={cn(
        'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
        role === 'user'
          ? 'self-end rounded-br-md bg-ink text-sand-50'
          : 'self-start rounded-bl-md bg-white text-ink shadow-sm',
      )}
    >
      {text}
    </p>
  )
}
