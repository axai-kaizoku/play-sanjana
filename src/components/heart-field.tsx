'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

type FloatHeart = {
  key: number
  left: number
  size: number
  delay: number
  duration: number
  opacity: number
  scale: number
}

/**
 * Ambient background of slowly rising hearts. Purely decorative, pointer-events
 * off, and generated only on the client after mount so the randomized layout
 * never causes a server/client hydration mismatch.
 */
export function HeartField({ count = 14, className }: { count?: number; className?: string }) {
  const [hearts, setHearts] = useState<FloatHeart[]>([])

  useEffect(() => {
    setHearts(
      Array.from({ length: count }, (_, i) => ({
        key: i,
        left: Math.random() * 100,
        size: 12 + Math.round(Math.random() * 26),
        delay: -(Math.random() * 18),
        duration: 16 + Math.random() * 16,
        opacity: 0.12 + Math.random() * 0.28,
        scale: 0.7 + Math.random() * 0.9,
      })),
    )
  }, [count])

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {hearts.map((h) => (
        <span
          key={h.key}
          className="animate-heart-float absolute bottom-[-40px] text-primary"
          style={{
            left: `${h.left}%`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            // custom props consumed by the heart-float keyframes
            ['--o' as string]: h.opacity,
            ['--s' as string]: h.scale,
          }}
        >
          <Heart style={{ width: h.size, height: h.size }} fill="currentColor" strokeWidth={0} />
        </span>
      ))}
    </div>
  )
}
