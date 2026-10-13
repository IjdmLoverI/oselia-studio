'use client'

import { MoveHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

type Picture = { url: string; alt: string; blurDataURL?: string }

type Props = {
  sketch: Picture
  result: Picture
  label: string
  sketchLabel: string
  resultLabel: string
}

export function BeforeAfter({ sketch, result, label, sketchLabel, resultLabel }: Props) {
  const [position, setPosition] = useState(50)

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-sand-200 shadow-card select-none sm:aspect-[16/9]">
      <Image
        src={result.url}
        alt={result.alt}
        fill
        priority
        sizes="(min-width: 1280px) 1200px, 100vw"
        placeholder={result.blurDataURL ? 'blur' : 'empty'}
        blurDataURL={result.blurDataURL}
        className="object-cover"
      />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image
          src={sketch.url}
          alt={sketch.alt}
          fill
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="object-cover"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white"
        style={{ left: `${position}%` }}
      >
        <span className="absolute top-1/2 left-1/2 grid size-12 -translate-1/2 place-items-center rounded-full bg-white text-ink shadow-card">
          <MoveHorizontal className="size-5" aria-hidden="true" />
        </span>
      </div>

      <span className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold backdrop-blur">
        {sketchLabel}
      </span>
      <span className="absolute top-4 right-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold backdrop-blur">
        {resultLabel}
      </span>

      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label={label}
        aria-valuetext={`${Math.round(position)}%`}
        className="absolute inset-0 size-full cursor-ew-resize appearance-none opacity-0"
      />
    </div>
  )
}
