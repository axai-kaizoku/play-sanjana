import { toast } from 'sonner'

// A grab-bag of unexpected, playful, lovey messages. Fired on random taps.
export const EGG_MESSAGES: string[] = [
  'Caught you! Akshay loves you 3000. 🐛',
  'Bug found: my heart keeps thinking about you.',
  'Error 143: too much love detected.',
  'Psst... you looked cute clicking that.',
  'Achievement unlocked: Sanjana is adorable.',
  'This button exists only to say: I miss you.',
  'Warning: extreme cuteness overload.',
  'Loading hugs... 100% delivered.',
  'You just found a secret. Reward: a virtual kiss.',
  'Fun fact: you are the reason I built this.',
  'Beep boop. I was programmed to adore you.',
  'Plot twist: the real prize was you all along.',
  '404: a day without missing you not found.',
  'Cheat code activated: infinite love.',
  'Somewhere, Akshay just smiled thinking of you.',
]

// Occasion-aware eggs get mixed in near special dates elsewhere if needed.
export const SPECIAL_EGGS: string[] = [
  'Since 02.12.2023 my favourite person has been you.',
  'Countdown to your birthday: 22 Feb, be ready to be spoiled.',
  'Reminder: you are officially stuck with me. No refunds.',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Fires an Easter-egg toast. `chance` gates how often it triggers so eggs
 * feel like surprises rather than spam. Returns whether it fired.
 */
export function maybeEasterEgg(chance = 0.5): boolean {
  if (Math.random() > chance) return false
  const pool = Math.random() < 0.2 ? SPECIAL_EGGS : EGG_MESSAGES
  toast(pick(pool), { className: 'font-sans' })
  return true
}

/** Always fire an egg (for dedicated secret spots). */
export function surpriseEgg() {
  toast(pick([...EGG_MESSAGES, ...SPECIAL_EGGS]))
}
