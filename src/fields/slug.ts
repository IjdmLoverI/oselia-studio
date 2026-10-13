import { slugField } from 'payload'

import { slugify } from '@/lib/slugify'

export const slug = () =>
  slugField({
    useAsSlug: 'title',
    slugify: ({ valueToSlugify }) =>
      typeof valueToSlugify === 'string' ? slugify(valueToSlugify) : undefined,
  })
