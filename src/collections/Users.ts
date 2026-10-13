import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { uk: 'Користувач', en: 'User' },
    plural: { uk: 'Користувачі', en: 'Users' },
  },
  admin: {
    useAsTitle: 'email',
    group: { uk: 'Адміністрування', en: 'Administration' },
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { uk: 'Ім’я', en: 'Name' },
    },
  ],
}
