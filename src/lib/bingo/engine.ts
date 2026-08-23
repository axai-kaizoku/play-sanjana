// Pure, framework-agnostic Bingo logic. No React, no storage — easy to test
// and reuse. The UI layer only renders what these functions compute.

export const BINGO_SIZES = [3, 4, 5, 6, 7] as const
export type BingoSize = (typeof BINGO_SIZES)[number]

// The word spelled out as lines complete. Length always equals the grid size,
// so a full word == a fully won board. Personalised for the two of us.
export const BINGO_WORDS: Record<BingoSize, string> = {
  3: 'WIN',
  4: 'LOVE',
  5: 'BINGO',
  6: 'AKSHAY',
  7: 'SANJANA',
}

export interface BingoBoard {
  size: BingoSize
  values: number[] // length size*size, the numbers printed on each cell
  marked: boolean[] // parallel array, whether each cell is marked
}

export interface BingoLine {
  id: string
  kind: 'row' | 'col' | 'diag'
  cells: number[] // flat indices making up this line
}

function shuffle<T>(input: T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Create a fresh, shuffled board of the given size. */
export function createBoard(size: BingoSize): BingoBoard {
  const total = size * size
  const values = shuffle(Array.from({ length: total }, (_, i) => i + 1))
  return { size, values, marked: Array<boolean>(total).fill(false) }
}

/** All winnable lines for a board size: every row, every column, both diagonals. */
export function getLines(size: number): BingoLine[] {
  const lines: BingoLine[] = []
  for (let r = 0; r < size; r++) {
    lines.push({
      id: `row-${r}`,
      kind: 'row',
      cells: Array.from({ length: size }, (_, c) => r * size + c),
    })
  }
  for (let c = 0; c < size; c++) {
    lines.push({
      id: `col-${c}`,
      kind: 'col',
      cells: Array.from({ length: size }, (_, r) => r * size + c),
    })
  }
  lines.push({
    id: 'diag-main',
    kind: 'diag',
    cells: Array.from({ length: size }, (_, i) => i * size + i),
  })
  lines.push({
    id: 'diag-anti',
    kind: 'diag',
    cells: Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)),
  })
  return lines
}

/** Lines that are fully marked on the given board. */
export function completedLines(board: BingoBoard): BingoLine[] {
  return getLines(board.size).filter((line) => line.cells.every((i) => board.marked[i]))
}

export interface BingoProgress {
  word: string
  completedCount: number
  lettersEarned: number
  isComplete: boolean
  completed: BingoLine[]
  /** Flat indices that belong to at least one completed line (for striking). */
  struckCells: Set<number>
}

/** Everything the UI needs to render current progress, derived from marks. */
export function getProgress(board: BingoBoard): BingoProgress {
  const word = BINGO_WORDS[board.size]
  const completed = completedLines(board)
  const lettersEarned = Math.min(completed.length, word.length)
  const struckCells = new Set<number>()
  for (const line of completed) for (const i of line.cells) struckCells.add(i)
  return {
    word,
    completedCount: completed.length,
    lettersEarned,
    isComplete: lettersEarned >= word.length,
    completed,
    struckCells,
  }
}

/** Toggle a cell, returning a new board (immutable update). */
export function toggleCell(board: BingoBoard, index: number): BingoBoard {
  const marked = board.marked.slice()
  marked[index] = !marked[index]
  return { ...board, marked }
}
