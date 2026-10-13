const ukrainian: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ie',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'i',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ю: 'iu',
  я: 'ia',
}

const wordStart: Record<string, string> = { є: 'ye', ї: 'yi', й: 'y', ю: 'yu', я: 'ya' }

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/зг/g, 'zgh')
    .replace(/[а-яґєії]/g, (char, index: number, text: string) => {
      const atWordStart = index === 0 || !/[\p{L}'’ʼ]/u.test(text[index - 1])
      return (atWordStart && wordStart[char]) || ukrainian[char] || ''
    })
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’ʼ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
