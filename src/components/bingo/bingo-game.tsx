'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, RotateCcw, Shuffle, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/site-header'
import { HeartField } from '@/components/heart-field'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useGameHistory } from '@/lib/games/history'
import { usePlayer } from '@/components/player-provider'
import { maybeEasterEgg } from '@/lib/easter-eggs'
import {
  BINGO_SIZES,
  type BingoBoard,
  type BingoSize,
  createBoard,
  getProgress,
  toggleCell,
} from '@/lib/bingo/engine'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'lovegames:bingo'
const DEFAULT_SIZE: BingoSize = 5

export function BingoGame() {
  const { value: stored, set: setStored, hydrated } = useLocalStorage<BingoBoard | null>(
    STORAGE_KEY,
    null,
  )
  const { add } = useGameHistory()
  const { name } = usePlayer()

  // Derive a guaranteed board once hydrated (fall back to a fresh 5×5).
  const board = useMemo<BingoBoard>(
    () => stored ?? createBoard(DEFAULT_SIZE),
    [stored],
  )

  // Make sure the fallback board is persisted so refreshes are stable.
  useEffect(() => {
    if (hydrated && !stored) setStored(createBoard(DEFAULT_SIZE))
  }, [hydrated, stored, setStored])

  const progress = useMemo(() => getProgress(board), [board])
  const [celebrate, setCelebrate] = useState(false)
  const wasComplete = useRef(false)

  // Fire the win celebration exactly once per transition into "complete".
  useEffect(() => {
    if (progress.isComplete && !wasComplete.current) {
      wasComplete.current = true
      setCelebrate(true)
      toast.success(`BINGO! You spelled ${progress.word}. I love you, ${name}!`, { duration: 5000 })
      add({
        game: 'bingo',
        title: `Bingo ${board.size}×${board.size} — ${progress.word}!`,
        detail: `Completed every ${progress.word} line. You won 💛`,
        status: 'won',
      })
      const t = setTimeout(() => setCelebrate(false), 5000)
      return () => clearTimeout(t)
    }
    if (!progress.isComplete) wasComplete.current = false
  }, [progress.isComplete, progress.word, board.size, name, add])

  const archiveIfProgress = useCallback(() => {
    if (!progress.isComplete && progress.lettersEarned > 0) {
      add({
        game: 'bingo',
        title: `Bingo ${board.size}×${board.size}`,
        detail: `Spelled ${progress.word.slice(0, progress.lettersEarned)} of ${progress.word}`,
        status: 'played',
      })
    }
  }, [progress, board.size, add])

  const handleToggle = useCallback(
    (index: number) => {
      if (progress.isComplete) return
      setStored(toggleCell(board, index))
      maybeEasterEgg(0.08)
    },
    [board, progress.isComplete, setStored],
  )

  const changeSize = useCallback(
    (size: BingoSize) => {
      if (size === board.size) return
      archiveIfProgress()
      wasComplete.current = false
      setStored(createBoard(size))
    },
    [board.size, archiveIfProgress, setStored],
  )

  const next = useCallback(() => {
    archiveIfProgress()
    wasComplete.current = false
    setStored(createBoard(board.size))
    toast('Fresh board — new numbers, same luck. 🍀')
  }, [archiveIfProgress, board.size, setStored])

  const reset = useCallback(() => {
    wasComplete.current = false
    setStored({ ...board, marked: Array<boolean>(board.values.length).fill(false) })
  }, [board, setStored])

  return (
    <div className="relative min-h-dvh">
      {celebrate && <HeartField count={26} className="z-50" />}
      <SiteHeader />

      <main className="mx-auto w-full max-w-xl px-4 py-6">
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
          <span className="text-sm text-muted-foreground">
            {progress.completedCount} line{progress.completedCount === 1 ? '' : 's'} complete
          </span>
        </div>

        <WordProgress word={progress.word} earned={progress.lettersEarned} />

        <SizePicker size={board.size} onChange={changeSize} />

        <BoardGrid
          board={board}
          struck={progress.struckCells}
          disabled={progress.isComplete}
          onToggle={handleToggle}
          ready={hydrated}
        />

        {progress.isComplete && (
          <div className="animate-pop mt-5 flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-center text-primary">
            <Trophy className="size-5" />
            <span className="font-medium">You completed {board.size}×{board.size} Bingo!</span>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" onClick={reset} className="h-12 rounded-2xl">
            <RotateCcw />
            Reset
          </Button>
          <Button size="lg" onClick={next} className="h-12 rounded-2xl">
            <Shuffle />
            Next board
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Tap numbers to mark them. Complete any row, column, or diagonal to earn the next letter of{' '}
          <span className="font-medium text-foreground">{progress.word}</span>.
        </p>
      </main>
    </div>
  )
}

function WordProgress({ word, earned }: { word: string; earned: number }) {
  return (
    <div className="mb-5 flex flex-wrap justify-center gap-2">
      {word.split('').map((letter, i) => {
        const on = i < earned
        return (
          <span
            key={i}
            className={cn(
              'grid size-11 place-items-center rounded-xl border font-serif text-xl font-semibold transition-all duration-300 sm:size-12 sm:text-2xl',
              on
                ? 'animate-pop border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-card text-muted-foreground/40',
            )}
          >
            {letter}
          </span>
        )
      })}
    </div>
  )
}

function SizePicker({ size, onChange }: { size: BingoSize; onChange: (s: BingoSize) => void }) {
  return (
    <div className="mb-5 flex items-center justify-center gap-1.5">
      {BINGO_SIZES.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          aria-pressed={s === size}
          className={cn(
            'h-9 min-w-11 rounded-full px-3 text-sm font-medium tabular-nums transition-colors',
            s === size
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
          )}
        >
          {s}×{s}
        </button>
      ))}
    </div>
  )
}

function BoardGrid({
  board,
  struck,
  disabled,
  onToggle,
  ready,
}: {
  board: BingoBoard
  struck: Set<number>
  disabled: boolean
  onToggle: (index: number) => void
  ready: boolean
}) {
  return (
    <div
      className="grid gap-1.5 sm:gap-2"
      style={{ gridTemplateColumns: `repeat(${board.size}, minmax(0, 1fr))` }}
    >
      {board.values.map((val, i) => {
        const marked = board.marked[i]
        const isStruck = struck.has(i)
        return (
          <button
            key={i}
            onClick={() => onToggle(i)}
            disabled={disabled || !ready}
            aria-pressed={marked}
            aria-label={`Number ${val}${marked ? ', marked' : ''}`}
            className={cn(
              'relative grid aspect-square place-items-center rounded-xl border font-semibold tabular-nums transition-all duration-150 select-none',
              board.size <= 4 ? 'text-xl sm:text-2xl' : board.size <= 6 ? 'text-base sm:text-lg' : 'text-sm sm:text-base',
              !marked && 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent/40 active:scale-95',
              marked && !isStruck && 'border-primary bg-primary text-primary-foreground shadow-sm',
              isStruck &&
                'border-primary bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md ring-2 ring-primary/30',
            )}
          >
            {val}
          </button>
        )
      })}
    </div>
  )
}
