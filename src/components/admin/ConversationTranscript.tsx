'use client'

import { useFormFields, useTranslation } from '@payloadcms/ui'

type Line = { role: string; text: string; at: string }

const labels = {
  uk: { user: 'Клієнт', assistant: 'Асистент', title: 'Розмова', empty: 'Повідомлень ще немає' },
  en: { user: 'Visitor', assistant: 'Assistant', title: 'Conversation', empty: 'No messages yet' },
}

export function ConversationTranscript() {
  const { i18n } = useTranslation()
  const text = i18n.language === 'en' ? labels.en : labels.uk
  const lines = useFormFields(([fields]) => {
    const count = Number(fields.messages?.value ?? 0)
    return Array.from({ length: count }, (_, index): Line => ({
      role: String(fields[`messages.${index}.role`]?.value ?? ''),
      text: String(fields[`messages.${index}.text`]?.value ?? ''),
      at: String(fields[`messages.${index}.at`]?.value ?? ''),
    }))
  })
  const time = new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-GB' : 'uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <section style={{ marginBottom: 32 }}>
      <h3 style={{ margin: '0 0 16px' }}>{text.title}</h3>
      {lines.length === 0 && <p style={{ color: 'var(--theme-elevation-500)' }}>{text.empty}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 760 }}>
        {lines.map((line, index) => {
          const fromVisitor = line.role === 'user'
          return (
            <div
              key={index}
              style={{
                alignSelf: fromVisitor ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: fromVisitor ? 'flex-end' : 'flex-start',
                gap: 4,
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--theme-elevation-500)' }}>
                {fromVisitor ? text.user : text.assistant}
                {line.at && ` · ${time.format(new Date(line.at))}`}
              </span>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                  background: fromVisitor ? '#1d1d1b' : 'var(--theme-elevation-100)',
                  color: fromVisitor ? '#faf7f2' : 'var(--theme-text)',
                }}
              >
                {line.text}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
