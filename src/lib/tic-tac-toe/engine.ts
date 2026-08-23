// Pure Tic Tac Toe logic. 'A' = Akshay, 'S' = Sanjana.
export type Mark = 'A' | 'S'
export type Cell = Mark | null

export const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export interface TicTacToeResult {
  winner: Mark | null
  line: number[] | null
  draw: boolean
}

export function evaluate(board: Cell[]): TicTacToeResult {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line, draw: false }
    }
  }
  const draw = board.every((c) => c !== null)
  return { winner: null, line: null, draw }
}

export function emptyBoard(): Cell[] {
  return Array<Cell>(9).fill(null)
}
