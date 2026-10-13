'use client'

import type { ComponentProps } from 'react'

import { Link, usePathname } from '@/i18n/navigation'

import type { Section } from './navigation'

type Props = Omit<ComponentProps<'a'>, 'href'> & { section: Section }

export function SectionLink({ section, ...props }: Props) {
  const pathname = usePathname()

  if (pathname === '/') return <a href={`#${section}`} {...props} />
  return <Link href={{ pathname: '/', hash: section }} {...props} />
}
