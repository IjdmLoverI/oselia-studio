import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import sharp from 'sharp'

import { anyone, authenticated } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

const addBlurPlaceholder: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (!req.file?.data) return data
  const preview = await sharp(req.file.data).resize(16).webp({ quality: 40 }).toBuffer()
  return { ...data, blurDataURL: `data:image/webp;base64,${preview.toString('base64')}` }
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { uk: 'Файл', en: 'File' },
    plural: { uk: 'Медіа', en: 'Media' },
  },
  admin: {
    group: { uk: 'Контент', en: 'Content' },
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeChange: [addBlurPlaceholder],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: { uk: 'Опис зображення', en: 'Alt text' },
    },
    {
      name: 'credit',
      type: 'group',
      label: { uk: 'Автор фото', en: 'Photo credit' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'author', type: 'text', label: { uk: 'Автор', en: 'Author' } },
            { name: 'url', type: 'text', label: { uk: 'Джерело', en: 'Source' } },
          ],
        },
      ],
    },
    {
      name: 'blurDataURL',
      type: 'text',
      admin: { hidden: true },
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
