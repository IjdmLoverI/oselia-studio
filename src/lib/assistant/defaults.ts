import type { Locale } from '@/i18n/routing'

export const assistantTexts: Record<'greeting' | 'visitInfo', Record<Locale, string>> = {
  greeting: {
    uk: 'Вітаю! Я асистент Oselia Studio. Підкажу орієнтовну вартість ремонту, відповім на питання й запишу на безкоштовний виїзд архітектора.',
    en: 'Hi! I am the Oselia Studio assistant. I can estimate the cost of your renovation, answer questions and book a free visit from our architect.',
  },
  visitInfo: {
    uk: 'Виїзд безкоштовний у Києві та області в межах 40 км. Архітектор приїжджає на 1–2 години: робить обміри й фото, обговорює побажання та бюджет. Кошторис надсилаємо протягом трьох робочих днів після виїзду.',
    en: 'The visit is free in Kyiv and up to 40 km around it. An architect comes for 1–2 hours to measure, take photos and talk through your wishes and budget. You get a cost estimate within three working days after the visit.',
  },
}
