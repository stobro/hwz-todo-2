import confetti from 'canvas-confetti'
import { readConfettiColors } from './theme'

// Rezept 3: Konfetti beim Abhaken, dezent, in Look-Farben. Kein Konfetti bei
// reduzierter Bewegung. In Tests ersetzbar (vi.mock).
export function celebrate(element: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = element.getBoundingClientRect()
  const origin = {
    x: (rect.left + rect.width / 2) / Math.max(1, window.innerWidth),
    y: (rect.top + rect.height / 2) / Math.max(1, window.innerHeight),
  }
  confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 25,
    scalar: 0.8,
    ticks: 120,
    colors: readConfettiColors(),
    origin,
  })
}
