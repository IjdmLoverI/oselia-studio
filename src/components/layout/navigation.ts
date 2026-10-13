export const sections = ['services', 'projects', 'process', 'pricing', 'faq', 'contact'] as const

export type Section = (typeof sections)[number]
