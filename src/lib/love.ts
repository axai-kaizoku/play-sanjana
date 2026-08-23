// Central place for all the personal / romantic constants.
// Keeping this isolated makes the "love theme" easy to tweak without touching UI.

export const PEOPLE = {
  her: { name: 'Sanjana', birthday: '2006-02-22' },
  him: { name: 'Akshay', birthday: '2001-09-15' },
} as const

export const RELATIONSHIP_START = '2023-12-02'

export const DEFAULT_NAME = PEOPLE.her.name

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Whole days elapsed since our first day together. */
export function daysTogether(now: Date = new Date()): number {
  const start = startOfDay(new Date(RELATIONSHIP_START))
  const today = startOfDay(now)
  const ms = today.getTime() - start.getTime()
  return Math.max(0, Math.floor(ms / 86_400_000))
}

/** Days until the next occurrence of a MM-DD anniversary/birthday. */
export function daysUntil(dateISO: string, now: Date = new Date()): number {
  const src = new Date(dateISO)
  const today = startOfDay(now)
  let next = new Date(today.getFullYear(), src.getMonth(), src.getDate())
  if (next < today) next = new Date(today.getFullYear() + 1, src.getMonth(), src.getDate())
  return Math.round((next.getTime() - today.getTime()) / 86_400_000)
}

/** Little rotating love notes shown across the app. */
export const LOVE_NOTES: string[] = [
  'I miss you a little more every single day.',
  'You are my favourite notification.',
  'Every board I shuffle, I still land on you.',
  'Distance is just a test to see how far love can travel.',
  'You are the best thing I never planned.',
  'If loving you was a game, I would play forever.',
  'Come here, I saved you a hug.',
  'You + me = my favourite equation.',
]

export function noteOfTheDay(now: Date = new Date()): string {
  const seed = daysTogether(now)
  return LOVE_NOTES[seed % LOVE_NOTES.length]
}
