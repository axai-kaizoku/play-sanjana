// A tiny registry so adding a new game is a one-object change and the hub page
// stays generic. Icons are referenced by name and resolved in the UI layer.

export type GameId = 'bingo' | 'tic-tac-toe'

export interface GameMeta {
  id: GameId
  title: string
  tagline: string
  href: string
  icon: 'dices' | 'grid'
  available: boolean
  /** Tailwind gradient stops used for the card accent. */
  from: string
  to: string
}

export const GAMES: GameMeta[] = [
  {
    id: 'bingo',
    title: 'Bingo',
    tagline: 'From 3×3 to 7×7 — spell your way to a win.',
    href: '/play/bingo',
    icon: 'dices',
    available: true,
    from: 'from-primary/25',
    to: 'to-accent/40',
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    tagline: 'Classic pass-and-play. Best of hearts wins.',
    href: '/play/tic-tac-toe',
    icon: 'grid',
    available: true,
    from: 'from-accent/40',
    to: 'to-primary/25',
  },
]

export function getGame(id: GameId): GameMeta | undefined {
  return GAMES.find((g) => g.id === id)
}
