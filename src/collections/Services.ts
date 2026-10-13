import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { slug } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: { uk: 'Послуга', en: 'Service' },
    plural: { uk: 'Послуги', en: 'Services' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'priceFrom', 'order'],
    group: { uk: 'Контент', en: 'Content' },
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: { uk: 'Назва', en: 'Title' },
    },
    slug(),
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
      label: { uk: 'Короткий опис', en: 'Summary' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { uk: 'Зображення', en: 'Image' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'priceFrom',
          type: 'number',
          min: 0,
          label: { uk: 'Ціна від, грн/м²', en: 'Price from, UAH/m²' },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          label: { uk: 'Порядок', en: 'Order' },
        },
      ],
    },
  ],
}
