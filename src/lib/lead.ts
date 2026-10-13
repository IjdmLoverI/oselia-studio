import { z } from 'zod'

export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, '')
  if (digits.length === 10 && digits.startsWith('0')) return `+38${digits}`
  if (digits.length === 12 && digits.startsWith('380')) return `+${digits}`
  if (input.trim().startsWith('+') && digits.length >= 10 && digits.length <= 15)
    return `+${digits}`
  return null
}

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().max(max).optional(),
  )

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'name').max(80, 'name'),
  phone: z.string().transform((value, context) => {
    const phone = normalizePhone(value)
    if (!phone) {
      context.addIssue({ code: 'custom', message: 'phone' })
      return z.NEVER
    }
    return phone
  }),
  message: optionalText(2000),
  consent: z.literal('on', 'consent'),
  area: z.preprocess(
    (value) => (value === '' || value == null ? undefined : value),
    z.coerce.number().int().min(1).max(10000).optional(),
  ),
  renovationType: z.enum(['cosmetic', 'capital', 'designer']).optional(),
  extras: z.array(z.string().max(40)).max(20).default([]),
  estimate: optionalText(120),
  locale: z.enum(['uk', 'en']),
})

export type LeadInput = z.infer<typeof leadSchema>
export type LeadField = 'name' | 'phone' | 'consent'

export function readLeadForm(formData: FormData) {
  return {
    name: formData.get('name') ?? '',
    phone: formData.get('phone') ?? '',
    message: formData.get('message') ?? undefined,
    consent: formData.get('consent') ?? undefined,
    area: formData.get('area') ?? undefined,
    renovationType: formData.get('renovationType') || undefined,
    extras: formData.getAll('extras'),
    estimate: formData.get('estimate') ?? undefined,
    locale: formData.get('locale') ?? 'uk',
  }
}

export function leadFieldErrors(error: z.ZodError) {
  const errors: Partial<Record<LeadField, true>> = {}
  for (const issue of error.issues) {
    const field = issue.path[0]
    if (field === 'name' || field === 'phone' || field === 'consent') errors[field] = true
  }
  return errors
}
