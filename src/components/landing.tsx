'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Cake, CalendarHeart, Gift, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { HeartField } from '@/components/heart-field'
import { usePlayer } from '@/components/player-provider'
import { maybeEasterEgg, surpriseEgg } from '@/lib/easter-eggs'
import { PEOPLE, daysTogether, daysUntil, noteOfTheDay } from '@/lib/love'

export function Landing() {
  const router = useRouter()
  const { name, setName, hasName, hydrated } = usePlayer()
  const [draft, setDraft] = useState('')
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (hydrated && hasName) setDraft(name)
  }, [hydrated, hasName, name])

  function enter(e: React.FormEvent) {
    e.preventDefault()
    const finalName = draft.trim() || PEOPLE.her.name
    setName(finalName)
    router.push('/play')
  }

  const together = mounted ? daysTogether() : null
  const herBday = mounted ? daysUntil(PEOPLE.her.birthday) : null
  const anniversary = mounted ? daysUntil('2023-12-02') : null

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <HeartField count={16} />

      {/* soft romantic glow, not a filler blob — anchors the palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
      />

      <div className="relative z-10 flex items-center justify-end p-4">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 pb-16 text-center">
        <button
          onClick={() => surpriseEgg()}
          className="animate-rise mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
          style={{ animationDelay: '40ms' }}
        >
          <Sparkles className="size-3.5 text-primary" />
          made with love, by {PEOPLE.him.name}
        </button>

        <h1
          className="animate-rise font-serif text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-7xl"
          style={{ animationDelay: '120ms' }}
        >
          Welcome,
          <br />
          <span className="relative inline-block text-primary">
            {hydrated && hasName ? name : PEOPLE.her.name}
            <Heart
              className="absolute -right-7 -top-2 size-6 text-primary sm:-right-9 sm:size-8"
              fill="currentColor"
              strokeWidth={0}
            />
          </span>
        </h1>

        <p
          className="animate-rise mt-6 max-w-md text-pretty text-base text-muted-foreground sm:text-lg"
          style={{ animationDelay: '200ms' }}
        >
          {mounted ? noteOfTheDay() : '\u00a0'} A tiny arcade I built so we can play together, even
          when we&apos;re apart.
        </p>

        {/* love stats — load-bearing, they tell our story */}
        <div
          className="animate-rise mt-8 grid w-full grid-cols-3 gap-3"
          style={{ animationDelay: '280ms' }}
        >
          <Stat icon={<CalendarHeart className="size-4" />} value={together} label="days together" />
          <Stat icon={<Gift className="size-4" />} value={anniversary} label="days to our day" />
          <Stat icon={<Cake className="size-4" />} value={herBday} label="days to your bday" />
        </div>

        <form
          onSubmit={enter}
          className="animate-rise mt-9 w-full max-w-sm"
          style={{ animationDelay: '360ms' }}
        >
          <label htmlFor="name" className="sr-only">
            Your name
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="name"
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={PEOPLE.her.name}
              autoComplete="off"
              className="h-12 flex-1 rounded-full border border-border bg-card/70 px-5 text-center text-base shadow-sm outline-none backdrop-blur-sm transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40 sm:text-left"
            />
            <Button type="submit" size="lg" className="h-12 rounded-full px-6 text-base">
              Let&apos;s play
              <ArrowRight />
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Everything stays on your device. No sign-up, just us.
          </p>
        </form>
      </div>

      <footer className="relative z-10 pb-6 text-center text-xs text-muted-foreground">
        <button onClick={() => maybeEasterEgg(1)} className="transition-colors hover:text-primary">
          Akshay &amp; {PEOPLE.her.name} · since 02 · 12 · 2023
        </button>
      </footer>
    </main>
  )
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number | null
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/70 bg-card/60 px-2 py-4 backdrop-blur-sm">
      <span className="text-primary">{icon}</span>
      <span className="font-serif text-2xl font-semibold tabular-nums sm:text-3xl">
        {value === null ? '—' : value}
      </span>
      <span className="text-[0.7rem] leading-tight text-muted-foreground">{label}</span>
    </div>
  )
}
