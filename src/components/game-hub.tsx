'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Dices, Grid3x3, History, Sparkles, Trash2, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/site-header'
import { usePlayer } from '@/components/player-provider'
import { GAMES, type GameMeta } from '@/lib/games/registry'
import { useGameHistory, type GameRecord } from '@/lib/games/history'
import { noteOfTheDay } from '@/lib/love'
import { cn } from '@/lib/utils'

const ICONS = {
  dices: Dices,
  grid: Grid3x3,
} as const

export function GameHub() {
  const { name, hydrated } = usePlayer()
  const { history, clear, hydrated: histReady } = useGameHistory()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="relative min-h-dvh">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <section className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            {mounted ? noteOfTheDay() : 'Pick something fun'}
          </span>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Choose your game
            {hydrated && (
              <span className="text-primary">
                , {name}
              </span>
            )}
          </h1>
          <p className="mt-2 text-muted-foreground">Pass-and-play — one device, two hearts.</p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {GAMES.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </section>

        <RecentGames history={history} clear={clear} ready={histReady} />
      </main>
    </div>
  )
}

function GameCard({ game, index }: { game: GameMeta; index: number }) {
  const Icon = ICONS[game.icon]
  return (
    <Link
      href={game.href}
      className="animate-rise group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ animationDelay: `${120 + index * 90}ms` }}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-gradient-to-br opacity-70 blur-2xl transition-opacity group-hover:opacity-100',
          game.from,
          game.to,
        )}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-6" />
          </span>
          <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <h2 className="mt-4 font-serif text-2xl font-semibold">{game.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{game.tagline}</p>
      </div>
    </Link>
  )
}

function RecentGames({
  history,
  clear,
  ready,
}: {
  history: GameRecord[]
  clear: () => void
  ready: boolean
}) {
  if (!ready || history.length === 0) return null
  return (
    <section className="animate-rise mt-10" style={{ animationDelay: '320ms' }}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <History className="size-4" />
          Recent games
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clear}
          className="h-8 gap-1.5 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
          Clear
        </Button>
      </div>
      <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card">
        {history.map((r) => (
          <li key={r.id} className="flex items-center gap-3 px-4 py-3">
            <span
              className={cn(
                'grid size-8 shrink-0 place-items-center rounded-full',
                r.status === 'won' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
              )}
            >
              {r.status === 'won' ? <Trophy className="size-4" /> : <Dices className="size-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{r.title}</p>
              <p className="truncate text-xs text-muted-foreground">{r.detail}</p>
            </div>
            <time className="shrink-0 text-xs text-muted-foreground" dateTime={new Date(r.at).toISOString()}>
              {relativeTime(r.at)}
            </time>
          </li>
        ))}
      </ul>
    </section>
  )
}

function relativeTime(at: number): string {
  const diff = Date.now() - at
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}
