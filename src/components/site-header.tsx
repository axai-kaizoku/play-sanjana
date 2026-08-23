'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { usePlayer } from '@/components/player-provider'
import { maybeEasterEgg } from '@/lib/easter-eggs'

export function SiteHeader() {
  const { name, hydrated } = usePlayer()
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
        <Link
          href="/"
          onClick={() => maybeEasterEgg(0.35)}
          className="group flex items-center gap-2 font-serif text-lg font-semibold tracking-tight"
        >
          <Heart className="size-5 text-primary transition-transform group-hover:scale-125" fill="currentColor" strokeWidth={0} />
          <span>Love Arcade</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {hydrated ? (
              <>
                Hi, <span className="font-medium text-foreground">{name}</span>
              </>
            ) : null}
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
