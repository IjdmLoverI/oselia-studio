import type { CollectionConfig, DateFieldValidation, FieldHook } from 'payload'

import { authenticated } from '../access'
import { renovationTypes } from './Leads'

export const bookingStatuses = ['new', 'confirmed', 'done', 'cancelled'] as const

const slotKey: FieldHook = ({ siblingData, originalDoc }) => {
  const status = siblingData.status ?? originalDoc?.status
  const visitAt = siblingData.visitAt ?? originalDoc?.visitAt
  if (!visitAt || status === 'cancelled') return null
  return new Date(visitAt).toISOString()
}

const visitAtIsFree: DateFieldValidation = async (value, { req, id, siblingData }) => {
  if (!value) return req.t('validation:required')
  if ((siblingData as { status?: string }).status === 'cancelled') return true

  const taken = await req.payload.count({
    collection: 'bookings',
    where: {
      and: [
        { slot: { equals: new Date(value).toISOString() } },
        ...(id ? [{ id: { not_equals: id } }] : []),
      ],
    },
    req,
  })
  return taken.totalDocs === 0
    ? true
    : req.i18n.language === 'en'
      ? 'This time is already booked'
      : 'Цей час уже зайнятий'
}

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: {
    singular: { uk: 'Виїзд', en: 'Site visit' },
    plural: { uk: 'Виїзди', en: 'Site visits' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['visitAt', 'name', 'phone', 'address', 'status', 'source'],
    group: { uk: 'Продажі', en: 'Sales' },
  },
  defaultSort: '-visitAt',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, label: { uk: 'Ім’я', en: 'Name' } },
        { name: 'phone', type: 'text', required: true, label: { uk: 'Телефон', en: 'Phone' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'visitAt',
          type: 'date',
          required: true,
          index: true,
          validate: visitAtIsFree,
          label: { uk: 'Дата й час виїзду', en: 'Visit date and time' },
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              timeIntervals: 30,
              displayFormat: 'dd.MM.yyyy HH:mm',
            },
          },
        },
        {
          name: 'address',
          type: 'text',
          required: true,
          label: { uk: 'Адреса або район', en: 'Address or district' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'renovationType',
          type: 'select',
          label: { uk: 'Тип ремонту', en: 'Renovation type' },
          options: [
            { value: renovationTypes[0], label: { uk: 'Косметичний', en: 'Cosmetic' } },
            { value: renovationTypes[1], label: { uk: 'Капітальний', en: 'Full' } },
            { value: renovationTypes[2], label: { uk: 'Дизайнерський', en: 'Designer' } },
          ],
        },
        {
          name: 'area',
          type: 'number',
          min: 0,
          label: { uk: 'Площа, м²', en: 'Area, m²' },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: { uk: 'Нотатки', en: 'Notes' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      label: { uk: 'Статус', en: 'Status' },
      options: [
        { value: 'new', label: { uk: 'Новий', en: 'New' } },
        { value: 'confirmed', label: { uk: 'Підтверджений', en: 'Confirmed' } },
        { value: 'done', label: { uk: 'Відбувся', en: 'Done' } },
        { value: 'cancelled', label: { uk: 'Скасований', en: 'Cancelled' } },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      label: { uk: 'Джерело', en: 'Source' },
      options: [
        { value: 'admin', label: { uk: 'Адмінка', en: 'Admin' } },
        { value: 'web', label: { uk: 'Чат на сайті', en: 'Site chat' } },
        { value: 'telegram', label: { uk: 'Telegram', en: 'Telegram' } },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'locale',
      type: 'text',
      label: { uk: 'Мова', en: 'Language' },
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'conversations',
      label: { uk: 'Розмова', en: 'Conversation' },
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'slot',
      type: 'text',
      unique: true,
      hooks: { beforeChange: [slotKey] },
      admin: { hidden: true },
    },
  ],
}
