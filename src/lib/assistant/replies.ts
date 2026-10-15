import type { Locale } from '@/i18n/routing'

export type CannedReply = 'unavailable' | 'busy' | 'slowDown' | 'tooLong' | 'failed'

const replies: Record<Locale, Record<CannedReply, string>> = {
  uk: {
    unavailable:
      'Асистент зараз не на звʼязку. Залиште заявку у формі на сайті або зателефонуйте нам: {phone}.',
    busy: 'Зараз дуже багато звернень, і я не встигаю відповісти. Спробуйте за хвилину або залиште заявку у формі на сайті.',
    slowDown: 'Ви пишете дуже часто. Зробіть, будь ласка, паузу на кілька хвилин.',
    tooLong: 'Повідомлення задовге. Напишіть, будь ласка, коротше, до 600 символів.',
    failed: 'Не вдалося відповісти. Спробуйте ще раз або залиште заявку у формі на сайті: {phone}.',
  },
  en: {
    unavailable:
      'The assistant is offline right now. Leave a request in the form on the site or call us: {phone}.',
    busy: 'There are too many requests right now and I cannot keep up. Try again in a minute or leave a request in the form on the site.',
    slowDown: 'You are writing very often. Please take a break for a few minutes.',
    tooLong: 'The message is too long. Please keep it under 600 characters.',
    failed: 'I could not reply. Try again or leave a request in the form on the site: {phone}.',
  },
}

export const cannedReply = (kind: CannedReply, locale: Locale, phone: string) =>
  replies[locale][kind].replace('{phone}', phone)
