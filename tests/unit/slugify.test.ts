import { describe, expect, it } from 'vitest'

import { slugify } from '@/lib/slugify'

describe('slugify', () => {
  it.each([
    ['Квартира на Подолі', 'kvartyra-na-podoli'],
    ['Таунхаус у Бучі', 'taunkhaus-u-buchi'],
    ['Коворкінг на Лук’янівці', 'kovorkinh-na-lukianivtsi'],
    ['Знам’янка', 'znamianka'],
    ['Згурівка', 'zghurivka'],
    ['Євген Їжак Юрій', 'yevhen-yizhak-yurii'],
    ['Олексіївка', 'oleksiivka'],
    ['Щастя', 'shchastia'],
  ])('transliterates %s', (input, expected) => {
    expect(slugify(input)).toBe(expected)
  })

  it('keeps latin text and trims separators', () => {
    expect(slugify('  Loft — 2025! ')).toBe('loft-2025')
  })

  it('drops diacritics', () => {
    expect(slugify('Café Crème')).toBe('cafe-creme')
  })
})
