import { useEffect, type RefObject } from 'react'

// Rezept 9: «N» fokussiert die Eingabe, ausser der Fokus ist schon in einem Eingabefeld.
export function useHotkey(key: string, target: RefObject<HTMLElement | null>) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== key) return
      const el = event.target
      if (el instanceof Element && el.matches('input, textarea, [contenteditable]')) return
      target.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key, target])
}
