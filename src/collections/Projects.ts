import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { slug } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const projectCategories = [
  'apartment',
  'house',
  'kitchen',
  'bathroom',
  'commercial',
] as const

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: { uk: 'Проєкт', en: 'Project' },
    plural: { uk: 'Проєкти', en: 'Projects' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'area', 'year', '_status'],
    group: { uk: 'Контент', en: 'Content' },
  },
  defaultSort: '-year',
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrAuthenticated,
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
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: { uk: 'Назва', en: 'Title' },
    },
    slug(),
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
      label: { uk: 'Короткий опис', en: 'Summary' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: { uk: 'Зображення', en: 'Images' },
          fields: [
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: { uk: 'Обкладинка (результат)', en: 'Cover (result)' },
            },
            {
              name: 'sketch',
              type: 'upload',
              relationTo: 'media',
              label: { uk: 'Ескіз того ж ракурсу', en: 'Sketch of the same view' },
              admin: {
                description: {
                  uk: 'Показується в повзунку «ескіз → реалізація» на сторінці проєкту.',
                  en: 'Shown in the sketch-to-result slider on the project page.',
                },
              },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: { uk: 'Галерея', en: 'Gallery' },
            },
          ],
        },
        {
          label: { uk: 'Деталі', en: 'Details' },
          fields: [
            {
              name: 'category',
              type: 'select',
              required: true,
              label: { uk: 'Тип об’єкта', en: 'Category' },
              options: [
                { value: 'apartment', label: { uk: 'Квартира', en: 'Apartment' } },
                { value: 'house', label: { uk: 'Будинок', en: 'House' } },
                { value: 'kitchen', label: { uk: 'Кухня', en: 'Kitchen' } },
                { value: 'bathroom', label: { uk: 'Санвузол', en: 'Bathroom' } },
                { value: 'commercial', label: { uk: 'Комерційне', en: 'Commercial' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'area',
                  type: 'number',
                  required: true,
                  min: 1,
                  label: { uk: 'Площа, м²', en: 'Area, m²' },
                },
                {
                  name: 'durationWeeks',
                  type: 'number',
                  required: true,
                  min: 1,
                  label: { uk: 'Тривалість, тижнів', en: 'Duration, weeks' },
                },
                {
                  name: 'budgetFrom',
                  type: 'number',
                  min: 0,
                  label: { uk: 'Бюджет від, грн', en: 'Budget from, UAH' },
                },
                {
                  name: 'year',
                  type: 'number',
                  required: true,
                  label: { uk: 'Рік', en: 'Year' },
                },
              ],
            },
            {
              name: 'district',
              type: 'text',
              required: true,
              localized: true,
              label: { uk: 'Район', en: 'District' },
            },
            {
              name: 'services',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              label: { uk: 'Виконані роботи', en: 'Work done' },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              label: { uk: 'Показувати першим', en: 'Show first' },
            },
          ],
        },
        {
          label: { uk: 'Опис', en: 'Story' },
          fields: [
            {
              name: 'body',
              type: 'richText',
              localized: true,
              label: { uk: 'Історія проєкту', en: 'Project story' },
            },
          ],
        },
      ],
    },
  ],
}
