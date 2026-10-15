import type { GlobalConfig } from 'payload'

import { authenticated } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

export const AssistantSettings: GlobalConfig = {
  slug: 'assistant-settings',
  label: { uk: 'Налаштування асистента', en: 'Assistant settings' },
  admin: { group: { uk: 'Асистент', en: 'Assistant' } },
  access: { read: authenticated, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      label: { uk: 'Асистент увімкнений', en: 'Assistant is on' },
      admin: {
        description: {
          uk: 'Вимкнений асистент зникає з сайту, а бот у Telegram пропонує залишити заявку.',
          en: 'When off, the site hides the chat and the Telegram bot suggests leaving a request.',
        },
      },
    },
    {
      name: 'greeting',
      type: 'textarea',
      required: true,
      localized: true,
      label: { uk: 'Привітання', en: 'Greeting' },
    },
    {
      name: 'visitInfo',
      type: 'textarea',
      required: true,
      localized: true,
      label: { uk: 'Що відбувається на виїзді', en: 'What happens at the visit' },
      admin: {
        description: {
          uk: 'Асистент пояснює це клієнтам перед записом.',
          en: 'The assistant explains this to visitors before booking.',
        },
      },
    },
    {
      name: 'schedule',
      type: 'group',
      label: { uk: 'Графік виїздів', en: 'Site visit schedule' },
      fields: [
        {
          name: 'workDays',
          type: 'select',
          hasMany: true,
          required: true,
          defaultValue: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
          label: { uk: 'Робочі дні', en: 'Working days' },
          options: [
            { value: 'mon', label: { uk: 'Понеділок', en: 'Monday' } },
            { value: 'tue', label: { uk: 'Вівторок', en: 'Tuesday' } },
            { value: 'wed', label: { uk: 'Середа', en: 'Wednesday' } },
            { value: 'thu', label: { uk: 'Четвер', en: 'Thursday' } },
            { value: 'fri', label: { uk: 'Пʼятниця', en: 'Friday' } },
            { value: 'sat', label: { uk: 'Субота', en: 'Saturday' } },
            { value: 'sun', label: { uk: 'Неділя', en: 'Sunday' } },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'dayStart',
              type: 'number',
              required: true,
              defaultValue: 10,
              min: 0,
              max: 23,
              label: { uk: 'Перший виїзд, год', en: 'First visit, hour' },
            },
            {
              name: 'dayEnd',
              type: 'number',
              required: true,
              defaultValue: 18,
              min: 1,
              max: 24,
              label: { uk: 'Кінець дня, год', en: 'Day ends, hour' },
            },
            {
              name: 'slotMinutes',
              type: 'number',
              required: true,
              defaultValue: 120,
              min: 30,
              max: 480,
              label: { uk: 'Тривалість виїзду, хв', en: 'Visit length, min' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'daysAhead',
              type: 'number',
              required: true,
              defaultValue: 14,
              min: 1,
              max: 60,
              label: { uk: 'Запис наперед, днів', en: 'Book ahead, days' },
            },
            {
              name: 'minNoticeHours',
              type: 'number',
              required: true,
              defaultValue: 12,
              min: 0,
              max: 168,
              label: { uk: 'Не раніше ніж за, год', en: 'Minimum notice, hours' },
            },
          ],
        },
      ],
    },
    {
      name: 'limits',
      type: 'group',
      label: { uk: 'Ліміти', en: 'Limits' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'perClient',
              type: 'number',
              required: true,
              defaultValue: 20,
              min: 1,
              label: {
                uk: 'Повідомлень від однієї людини за 10 хв',
                en: 'Messages per person per 10 min',
              },
            },
            {
              name: 'perDay',
              type: 'number',
              required: true,
              defaultValue: 300,
              min: 1,
              label: {
                uk: 'Повідомлень на день для всього сайту',
                en: 'Messages per day, whole site',
              },
            },
          ],
        },
      ],
    },
  ],
}
