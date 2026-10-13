import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
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
      label: { uk: "Ім'я", en: 'Name' },
    },
  ],
}
