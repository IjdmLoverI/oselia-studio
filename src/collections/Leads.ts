import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

export const renovationTypes = ['cosmetic', 'capital', 'designer'] as const

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: { uk: 'Заявка', en: 'Lead' },
    plural: { uk: 'Заявки', en: 'Leads' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'renovationType', 'status', 'createdAt'],
    group: { uk: 'Продажі', en: 'Sales' },
  },
  defaultSort: '-createdAt',
  access: {
    read: authenticated,
    create: () => false,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, label: { uk: "Ім'я", en: 'Name' } },
        { name: 'phone', type: 'text', required: true, label: { uk: 'Телефон', en: 'Phone' } },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: { uk: 'Повідомлення', en: 'Message' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'area',
          type: 'number',
          min: 0,
          label: { uk: 'Площа, м²', en: 'Area, m²' },
        },
        {
          name: 'renovationType',
          type: 'select',
          label: { uk: 'Тип ремонту', en: 'Renovation type' },
          options: [
            { value: 'cosmetic', label: { uk: 'Косметичний', en: 'Cosmetic' } },
            { value: 'capital', label: { uk: 'Капітальний', en: 'Full' } },
            { value: 'designer', label: { uk: 'Дизайнерський', en: 'Designer' } },
          ],
        },
        {
          name: 'estimate',
          type: 'text',
          label: { uk: 'Попередня оцінка', en: 'Estimate' },
        },
      ],
    },
    {
      name: 'extras',
      type: 'text',
      hasMany: true,
      label: { uk: 'Додаткові роботи', en: 'Extras' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      label: { uk: 'Статус', en: 'Status' },
      options: [
        { value: 'new', label: { uk: 'Нова', en: 'New' } },
        { value: 'in_progress', label: { uk: 'В роботі', en: 'In progress' } },
        { value: 'done', label: { uk: 'Закрита', en: 'Closed' } },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'locale',
      type: 'text',
      label: { uk: 'Мова сайту', en: 'Site language' },
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'ipHash',
      type: 'text',
      index: true,
      admin: { hidden: true },
    },
  ],
}
