'use client'

import { Check, X } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useLocale, useTranslations } from 'next-intl'
import { useActionState, useId, useRef, useState, type ReactNode } from 'react'

import { submitLead, type LeadState } from '@/actions/submit-lead'
import { buttonStyles } from '@/components/ui/Button'
import { saveEstimate, useSavedEstimate } from '@/lib/estimate-store'
import { cn } from '@/lib/utils'

const initialState: LeadState = { status: 'idle' }

const fieldClass =
  'mt-2 w-full rounded-xl border border-ink/15 bg-sand-50 px-4 py-3 text-base outline-none transition-colors placeholder:text-ink/40 focus:border-accent-500 focus:bg-white aria-invalid:border-red-700'

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm() {
  const t = useTranslations('contact.form')
  const types = useTranslations('calculator')
  const locale = useLocale()
  const id = useId()
  const estimate = useSavedEstimate()
  const firstFocus = useRef<number | null>(null)
  const [state, dispatch, pending] = useActionState(submitLead, initialState)
  const [dismissed, setDismissed] = useState<LeadState | null>(null)

  const shown = state === dismissed ? initialState : state
  const invalid = shown.status === 'invalid' ? shown.fields : {}
  const errorMessage = shown.status === 'error' ? t(`errors.${shown.reason}`) : null

  const submit = (formData: FormData) => {
    const started = firstFocus.current
    formData.set(
      'fillTime',
      started === null ? '0' : String(Math.round(performance.now() - started)),
    )
    dispatch(formData)
  }

  const reset = () => {
    setDismissed(state)
    firstFocus.current = null
  }

  return (
    <div className="relative overflow-hidden rounded-card bg-white p-6 text-ink shadow-card sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {shown.status === 'success' ? (
          <m.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex min-h-96 flex-col items-center justify-center text-center"
            role="status"
          >
            <m.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              className="grid size-16 place-items-center rounded-full bg-accent-600 text-white"
            >
              <Check className="size-8" aria-hidden="true" />
            </m.span>
            <p className="mt-6 font-display text-2xl font-semibold">{t('successTitle')}</p>
            <p className="mt-2 text-muted">{t('successText')}</p>
            <button
              type="button"
              onClick={reset}
              className={cn(buttonStyles({ variant: 'outline' }), 'mt-8')}
            >
              {t('again')}
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            action={submit}
            onFocusCapture={() => {
              firstFocus.current ??= performance.now()
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            noValidate
            className="space-y-5"
          >
            <input type="hidden" name="locale" value={locale} />
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label>
                Company
                <input type="text" name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`${id}-name`} label={t('name')} error={invalid.name && t('errors.name')}>
                <input
                  id={`${id}-name`}
                  name="name"
                  required
                  autoComplete="name"
                  placeholder={t('namePlaceholder')}
                  aria-invalid={invalid.name}
                  aria-describedby={invalid.name ? `${id}-name-error` : undefined}
                  className={fieldClass}
                />
              </Field>
              <Field
                id={`${id}-phone`}
                label={t('phone')}
                error={invalid.phone && t('errors.phone')}
              >
                <input
                  id={`${id}-phone`}
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={t('phonePlaceholder')}
                  aria-invalid={invalid.phone}
                  aria-describedby={invalid.phone ? `${id}-phone-error` : undefined}
                  className={fieldClass}
                />
              </Field>
            </div>

            <Field id={`${id}-message`} label={t('message')}>
              <textarea
                id={`${id}-message`}
                name="message"
                rows={4}
                maxLength={2000}
                placeholder={t('messagePlaceholder')}
                className={cn(fieldClass, 'resize-y')}
              />
            </Field>

            {estimate && (
              <div className="flex items-start justify-between gap-4 rounded-xl bg-sand-100 p-4 text-sm">
                <div>
                  <p className="font-semibold">{t('estimate')}</p>
                  <p className="mt-1 text-muted">
                    {types('summary', {
                      area: estimate.area,
                      type: types(`types.${estimate.type}`),
                    })}
                    {' · '}
                    {types('range', { min: estimate.min, max: estimate.max })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => saveEstimate(null)}
                  aria-label={t('removeEstimate')}
                  className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-sand-200"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
                <input type="hidden" name="area" value={estimate.area} />
                <input type="hidden" name="renovationType" value={estimate.type} />
                {estimate.extras.map((extra) => (
                  <input key={extra} type="hidden" name="extras" value={extra} />
                ))}
                <input
                  type="hidden"
                  name="estimate"
                  value={types('range', { min: estimate.min, max: estimate.max })}
                />
              </div>
            )}

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  aria-invalid={invalid.consent}
                  className="mt-0.5 size-5 shrink-0 accent-accent-600"
                />
                <span>{t('consent')}</span>
              </label>
              {invalid.consent && (
                <p className="mt-1.5 text-sm text-red-700">{t('errors.consent')}</p>
              )}
            </div>

            {errorMessage && (
              <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className={cn(buttonStyles({ size: 'lg' }), 'w-full')}
            >
              {pending ? t('sending') : t('submit')}
            </button>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  )
}
