import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: { uk: 'Відгук', en: 'Testimonial' },
    plural: { uk: 'Відгуки', en: 'Testimonials' },
  },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'project', 'rating'],
    group: { uk: 'Контент', en: 'Content' },
  },
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
      name: 'author',
      type: 'text',
      required: true,
      localized: true,
      label: { uk: 'Автор', en: 'Author' },
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      localized: true,
      label: { uk: 'Текст', en: 'Text' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 1,
          max: 5,
          defaultValue: 5,
          label: { uk: 'Оцінка', en: 'Rating' },
        },
        {
          name: 'project',
          type: 'relationship',
          relationTo: 'projects',
          label: { uk: 'Проєкт', en: 'Project' },
        },
      ],
    },
  ],
}
