'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, Heart, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/site-header'
import { HeartField } from '@/components/heart-field'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useGameHistory } from '@/lib/games/history'
import { maybeEasterEgg } from '@/lib/easter-eggs'
import { PEOPLE } from '@/lib/love'
import { type Cell, type Mark, emptyBoard, evaluate } from '@/lib/tic-tac-toe/engine'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'lovegames:ttt'
const LABELS: Record<Mark, string> = { A: PEOPLE.him.name, S: PEOPLE.her.name }

interface TttState {
  board: Cell[]
  turn: Mark
}

export function TicTacToeGame() {
  const { value: state, set, hydrated } = useLocalStorage<TttState>(STORAGE_KEY, {
    board: emptyBoard(),
    turn: 'S',
  })
  const { add } = useGameHistory()
  const result = useMemo(() => evaluate(state.board), [state.board])
  const [celebrate, setCelebrate] = useState(false)
  const recorded = useRef(false)

  useEffect(() => {
    if ((result.winner || result.draw) && !recorded.current) {
      recorded.current = true
      if (result.winner) {
        setCelebrate(true)
        toast.success(`${LABELS[result.winner]} wins this round! 💘`, { duration: 4500 })
        add({
          game: 'tic-tac-toe',
          title: `Tic Tac Toe — ${LABELS[result.winner]} won`,
          detail: `${LABELS.S} vs ${LABELS.A}`,
          status: 'won',
        })
        const t = setTimeout(() => setCelebrate(false), 4500)
        return () => clearTimeout(t)
      }
      toast('A perfect tie — clearly made for each other. 🤝')
      add({
        game: 'tic-tac-toe',
        title: 'Tic Tac Toe — draw',
        detail: `${LABELS.S} vs ${LABELS.A}`,
        status: 'played',
      })
    }
    if (!result.winner && !result.draw) recorded.current = false
  }, [result, add])

  const play = useCallback(
    (i: number) => {
      if (state.board[i] || result.winner) return
      const board = state.board.slice()
      board[i] = state.turn
      set({ board, turn: state.turn === 'A' ? 'S' : 'A' })
      maybeEasterEgg(0.1)
    },
    [state, result.winner, set],
  )

  const reset = useCallback(() => {
    recorded.current = false
    setCelebrate(false)
    set({ board: emptyBoard(), turn: 'S' })
  }, [set])

  const status = result.winner
    ? `${LABELS[result.winner]} wins!`
    : result.draw
      ? "It's a tie!"
      : `${LABELS[state.turn]}'s turn`

  return (
    <div className="relative min-h-dvh">
      {celebrate && <HeartField count={24} className="z-50" />}
      <SiteHeader />

      <main className="mx-auto w-full max-w-md px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <Button
            render={<Link href="/play" />}
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1.5 text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            Games
          </Button>
        </div>

        <div className="mb-5 flex items-center justify-center gap-3">
          <PlayerChip mark="S" active={!result.winner && !result.draw && state.turn === 'S'} />
          <span className="text-sm font-medium text-muted-foreground">vs</span>
          <PlayerChip mark="A" active={!result.winner && !result.draw && state.turn === 'A'} />
        </div>

        <p
          className={cn(
            'mb-5 text-center font-serif text-2xl font-semibold',
            result.winner ? 'text-primary' : 'text-foreground',
          )}
          aria-live="polite"
        >
          {hydrated ? status : '\u00a0'}
        </p>

        <div className="grid grid-cols-3 gap-2">
          {state.board.map((cell, i) => {
            const inWin = result.line?.includes(i)
            return (
              <button
                key={i}
                onClick={() => play(i)}
                disabled={!hydrated || !!cell || !!result.winner}
                aria-label={`Cell ${i + 1}${cell ? `, ${LABELS[cell]}` : ''}`}
                className={cn(
                  'grid aspect-square place-items-center rounded-2xl border text-4xl font-semibold transition-all sm:text-5xl',
                  'border-border bg-card hover:border-primary/50 hover:bg-accent/40 active:scale-95 disabled:cursor-default disabled:active:scale-100',
                  inWin && 'border-primary bg-primary/15 ring-2 ring-primary/40',
                )}
              >
                {cell && <MarkGlyph mark={cell} />}
              </button>
            )
          })}
        </div>

        <Button variant="outline" size="lg" onClick={reset} className="mt-5 h-12 w-full rounded-2xl">
          <RotateCcw />
          New round
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Pass the phone back and forth. {LABELS.S} goes first.
        </p>
      </main>
    </div>
  )
}

function MarkGlyph({ mark }: { mark: Mark }) {
  if (mark === 'S') {
    return <Heart className="size-9 text-primary sm:size-10" fill="currentColor" strokeWidth={0} />
  }
  return <span className="font-serif text-primary/80">A</span>
}

function PlayerChip({ mark, active }: { mark: Mark; active: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-card text-muted-foreground',
      )}
    >
      {mark === 'S' ? (
        <Heart className="size-3.5" fill="currentColor" strokeWidth={0} />
      ) : (
        <span className="font-serif text-xs">A</span>
      )}
      {LABELS[mark]}
    </span>
  )
}
