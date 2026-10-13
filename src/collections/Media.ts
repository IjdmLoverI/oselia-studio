import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: { uk: 'Контент', en: 'Content' },
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: { uk: 'Опис зображення', en: 'Alt text' },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 960 },
      { name: 'wide', width: 1920 },
    ],
    adminThumbnail: 'thumb',
  },
}
