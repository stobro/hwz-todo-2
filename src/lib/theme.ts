// Werte für JavaScript: aus den CSS-Variablen lesen, nie Hex-Werte im Code (DESIGN.md).
export function readConfettiColors(): string[] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--confetti')
  return raw
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
}
