'use client'

import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { ButtonLink } from '@/components/ui/Button'
import { Link } from '@/i18n/navigation'

import { LocaleSwitcher } from './LocaleSwitcher'
import { Logo } from './Logo'
import { sections } from './navigation'

export function MobileMenu() {
  const t = useTranslations()
  const dialog = useRef<HTMLDialogElement>(null)

  const open = () => dialog.current?.showModal()
  const close = () => dialog.current?.close()

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label={t('nav.openMenu')}
        aria-haspopup="dialog"
        className="grid size-11 place-items-center rounded-full border border-ink/15 lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <dialog
        ref={dialog}
        aria-label={t('nav.main')}
        onClick={(event) => event.target === event.currentTarget && close()}
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-sand-50 text-ink backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col px-6 py-5">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={close}
              aria-label={t('nav.closeMenu')}
              className="grid size-11 place-items-center rounded-full border border-ink/15"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="mt-10">
            <ul>
              {sections.map((section) => (
                <li key={section}>
                  <Link
                    href={{ pathname: '/', hash: section }}
                    onClick={close}
                    className="block py-3 font-display text-2xl"
                  >
                    {t(`nav.${section}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto space-y-5">
            <LocaleSwitcher />
            <ButtonLink
              href={{ pathname: '/', hash: 'pricing' }}
              onClick={close}
              size="lg"
              className="w-full"
            >
              {t('nav.cta')}
            </ButtonLink>
          </div>
        </div>
      </dialog>
    </>
  )
}
