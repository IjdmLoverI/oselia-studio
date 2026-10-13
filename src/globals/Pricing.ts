import type { GlobalConfig } from 'payload'

import { renovationTypes } from '../collections/Leads'
import { anyone, authenticated } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const Pricing: GlobalConfig = {
  slug: 'pricing',
  label: { uk: 'Калькулятор вартості', en: 'Cost calculator' },
  admin: {
    group: { uk: 'Налаштування', en: 'Settings' },
    description: {
      uk: 'Ставки без матеріалів. Калькулятор показує діапазон −10% … +15% від розрахованої суми.',
      en: 'Labour rates without materials. The calculator shows a −10% … +15% range around the total.',
    },
  },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'types',
      type: 'array',
      required: true,
      minRows: 1,
      label: { uk: 'Типи ремонту', en: 'Renovation types' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'key',
              type: 'select',
              required: true,
              options: [...renovationTypes],
              label: { uk: 'Тип', en: 'Type' },
            },
            {
              name: 'pricePerSqm',
              type: 'number',
              required: true,
              min: 0,
              label: { uk: 'Ціна, грн/м²', en: 'Price, UAH/m²' },
            },
          ],
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          localized: true,
          label: { uk: 'Що входить', en: 'What is included' },
        },
      ],
    },
    {
      name: 'extras',
      type: 'array',
      label: { uk: 'Додаткові роботи', en: 'Extras' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'key', type: 'text', required: true, label: { uk: 'Ключ', en: 'Key' } },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              label: { uk: 'Назва', en: 'Label' },
            },
            {
              name: 'price',
              type: 'number',
              required: true,
              min: 0,
              label: { uk: 'Ціна, грн', en: 'Price, UAH' },
            },
            {
              name: 'perSqm',
              type: 'checkbox',
              defaultValue: false,
              label: { uk: 'За м²', en: 'Per m²' },
            },
          ],
        },
      ],
    },
  ],
}
