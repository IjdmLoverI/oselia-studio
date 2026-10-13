'use client'

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useEffect, type CSSProperties } from 'react'

import linen from '@/assets/materials/linen.webp'
import oak from '@/assets/materials/oak.webp'
import stone from '@/assets/materials/stone.webp'
import terracotta from '@/assets/materials/terracotta.webp'
import { useFinePointer } from '@/lib/use-media-query'
import { cn } from '@/lib/utils'

const textures = { stone, oak, terracotta, linen }

export type Material = keyof typeof textures

type Sphere = {
  material: Material
  size: string
  position: string
  depth: number
  delay: number
  float: number
}

const spheres: Sphere[] = [
  {
    material: 'terracotta',
    size: 'clamp(4.5rem, 9vw, 8rem)',
    position: '-left-6 top-10 sm:-left-14',
    depth: 1.3,
    delay: 250,
    float: 8,
  },
  {
    material: 'linen',
    size: 'clamp(3rem, 5vw, 4.5rem)',
    position: 'left-[22%] -top-5',
    depth: 0.6,
    delay: 400,
    float: 6.5,
  },
  {
    material: 'oak',
    size: 'clamp(3.5rem, 6vw, 5.5rem)',
    position: '-right-4 top-[42%] sm:-right-9',
    depth: 0.9,
    delay: 550,
    float: 7.5,
  },
  {
    material: 'stone',
    size: 'clamp(5rem, 10vw, 9rem)',
    position: '-right-2 -bottom-8 sm:-right-12',
    depth: 1.6,
    delay: 700,
    float: 10,
  },
]

export function MaterialSpheres({ labels }: { labels: Record<Material, string> }) {
  const finePointer = useFinePointer()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 50, damping: 18 })
  const y = useSpring(pointerY, { stiffness: 50, damping: 18 })

  useEffect(() => {
    if (!finePointer) return
    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5)
      pointerY.set(event.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [finePointer, pointerX, pointerY])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {spheres.map((sphere) => (
        <SphereItem
          key={sphere.material}
          sphere={sphere}
          label={labels[sphere.material]}
          x={x}
          y={y}
        />
      ))}
    </div>
  )
}

function SphereItem({
  sphere,
  label,
  x,
  y,
}: {
  sphere: Sphere
  label: string
  x: MotionValue<number>
  y: MotionValue<number>
}) {
  const shiftX = useTransform(x, (value) => value * sphere.depth * -70)
  const shiftY = useTransform(y, (value) => value * sphere.depth * -70)

  return (
    <motion.div style={{ x: shiftX, y: shiftY }} className={cn('absolute', sphere.position)}>
      <div className="intro-fade" style={{ '--d': `${sphere.delay}ms` } as CSSProperties}>
        <div className="float-slow group" style={{ animationDuration: `${sphere.float}s` }}>
          <span
            className="material-sphere pointer-events-auto transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-110"
            style={{
              width: sphere.size,
              height: sphere.size,
              backgroundImage: `url(${textures[sphere.material].src})`,
              backgroundSize: 'cover',
            }}
          />
          <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold whitespace-nowrap opacity-0 shadow-card transition-opacity duration-300 group-hover:opacity-100">
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
