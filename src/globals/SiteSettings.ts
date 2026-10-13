import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { uk: 'Налаштування сайту', en: 'Site settings' },
  admin: { group: { uk: 'Налаштування', en: 'Settings' } },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', required: true, label: { uk: 'Телефон', en: 'Phone' } },
        { name: 'email', type: 'email', required: true, label: { uk: 'Email', en: 'Email' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'address',
          type: 'text',
          required: true,
          localized: true,
          label: { uk: 'Адреса', en: 'Address' },
        },
        {
          name: 'hours',
          type: 'text',
          required: true,
          localized: true,
          label: { uk: 'Графік роботи', en: 'Opening hours' },
        },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      label: { uk: 'Цифри на першому екрані', en: 'Hero numbers' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'years',
              type: 'number',
              required: true,
              min: 0,
              label: { uk: 'Років на ринку', en: 'Years on the market' },
            },
            {
              name: 'projects',
              type: 'number',
              required: true,
              min: 0,
              label: { uk: 'Завершених об’єктів', en: 'Completed projects' },
            },
            {
              name: 'warranty',
              type: 'number',
              required: true,
              min: 0,
              label: { uk: 'Років гарантії', en: 'Warranty, years' },
            },
          ],
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      label: { uk: 'Соцмережі', en: 'Social links' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: ['instagram', 'facebook', 'telegram', 'youtube'],
              label: { uk: 'Мережа', en: 'Platform' },
            },
            { name: 'url', type: 'text', required: true, label: { uk: 'Посилання', en: 'URL' } },
          ],
        },
      ],
    },
  ],
}
