import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: { uk: 'Питання', en: 'Question' },
    plural: { uk: 'Часті питання', en: 'FAQ' },
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order'],
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
      name: 'question',
      type: 'text',
      required: true,
      localized: true,
      label: { uk: 'Питання', en: 'Question' },
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      localized: true,
      label: { uk: 'Відповідь', en: 'Answer' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: { uk: 'Порядок', en: 'Order' },
      admin: { position: 'sidebar' },
    },
  ],
}
