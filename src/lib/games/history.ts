'use client'

import { useCallback } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import type { GameId } from './registry'

export interface GameRecord {
  id: string
  game: GameId
  title: string
  detail: string
  status: 'won' | 'played'
  at: number // epoch ms
}

const KEY = 'lovegames:history'
const MAX = 20

export function useGameHistory() {
  const { value, set, hydrated } = useLocalStorage<GameRecord[]>(KEY, [])

  const add = useCallback(
    (record: Omit<GameRecord, 'id' | 'at'>) => {
      const entry: GameRecord = {
        ...record,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        at: Date.now(),
      }
      set((prev) => [entry, ...prev].slice(0, MAX))
    },
    [set],
  )

  const clear = useCallback(() => set([]), [set])

  return { history: value, add, clear, hydrated } as const
}
