import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

export const Conversations: CollectionConfig = {
  slug: 'conversations',
  labels: {
    singular: { uk: 'Розмова', en: 'Conversation' },
    plural: { uk: 'Розмови', en: 'Conversations' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'channel', 'booking', 'lastMessageAt'],
    group: { uk: 'Асистент', en: 'Assistant' },
  },
  defaultSort: '-lastMessageAt',
  access: {
    read: authenticated,
    create: () => false,
    update: () => false,
    delete: authenticated,
  },
  indexes: [{ fields: ['channel', 'externalId'], unique: true }],
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { uk: 'Перше питання', en: 'First question' },
      admin: { readOnly: true },
    },
    {
      name: 'messages',
      type: 'array',
      label: { uk: 'Повідомлення', en: 'Messages' },
      admin: { readOnly: true, initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'role',
              type: 'select',
              required: true,
              label: { uk: 'Хто', en: 'From' },
              options: [
                { value: 'user', label: { uk: 'Клієнт', en: 'Visitor' } },
                { value: 'assistant', label: { uk: 'Асистент', en: 'Assistant' } },
              ],
              admin: { width: '20%' },
            },
            {
              name: 'at',
              type: 'date',
              required: true,
              label: { uk: 'Час', en: 'Time' },
              admin: {
                width: '30%',
                date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd.MM.yyyy HH:mm' },
              },
            },
          ],
        },
        { name: 'text', type: 'textarea', required: true, label: { uk: 'Текст', en: 'Text' } },
      ],
    },
    {
      name: 'channel',
      type: 'select',
      required: true,
      label: { uk: 'Канал', en: 'Channel' },
      options: [
        { value: 'web', label: { uk: 'Чат на сайті', en: 'Site chat' } },
        { value: 'telegram', label: { uk: 'Telegram', en: 'Telegram' } },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'externalId',
      type: 'text',
      required: true,
      label: { uk: 'Ідентифікатор', en: 'External ID' },
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'locale',
      type: 'text',
      label: { uk: 'Мова', en: 'Language' },
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      label: { uk: 'Виїзд', en: 'Site visit' },
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'lastMessageAt',
      type: 'date',
      index: true,
      label: { uk: 'Останнє повідомлення', en: 'Last message' },
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd.MM.yyyy HH:mm' },
      },
    },
    {
      name: 'tokens',
      type: 'number',
      defaultValue: 0,
      label: { uk: 'Токенів витрачено', en: 'Tokens used' },
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'pendingBooking',
      type: 'json',
      admin: { hidden: true },
    },
    {
      name: 'ipHash',
      type: 'text',
      index: true,
      admin: { hidden: true },
    },
  ],
}
