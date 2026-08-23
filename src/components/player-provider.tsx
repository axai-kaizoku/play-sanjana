'use client'

import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { DEFAULT_NAME } from '@/lib/love'

interface PlayerContextValue {
  name: string
  setName: (name: string) => void
  hasName: boolean
  hydrated: boolean
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { value, set, hydrated } = useLocalStorage<string>('lovegames:player', '')

  const ctx = useMemo<PlayerContextValue>(
    () => ({
      name: value || DEFAULT_NAME,
      setName: (n: string) => set(n.trim()),
      hasName: value.trim().length > 0,
      hydrated,
    }),
    [value, set, hydrated],
  )

  return <PlayerContext.Provider value={ctx}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
