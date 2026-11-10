import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MapPinOff, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createMap, type MapHandle } from '@/lib/map'
import { STATUS_LABELS, STATUSES, type Location, type Task } from '@/features/tasks/model'
import { boundsOf, locationSummary, pinClass, tasksWithLocation } from '@/features/map/model'
import { cn } from '@/lib/utils'
import { MapPin } from './MapPin'

type TaskMapProps = {
  tasks: Task[]
  // Setz-Modus: die nächste Klickstelle auf der Karte wird der Ort dieser Aufgabe.
  placingTask?: Task | null
  onPlace?: (id: string, location: Location) => void
  onCancelPlacing?: () => void
  // Verbindung zum Board.
  selectedId?: string | null
  highlightedId?: string | null
  onSelect?: (id: string) => void
}

export function TaskMap({
  tasks,
  placingTask = null,
  onPlace,
  onCancelPlacing,
  selectedId = null,
  highlightedId = null,
  onSelect,
}: TaskMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<MapHandle | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const located = tasksWithLocation(tasks)

  // Die Karte entsteht nur einmal; Klicks lesen den aktuellen Setz-Modus über eine Ref.
  const placingRef = useRef({ placingTask, onPlace })
  useEffect(() => {
    placingRef.current = { placingTask, onPlace }
  })

  useEffect(() => {
    map?.setPlacing(placingTask !== null)
  }, [map, placingTask])

  useEffect(() => {
    if (!placingTask) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancelPlacing?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [placingTask, onCancelPlacing])

  // Ausschnitt einmal über alle Pins legen, sobald die Karte geladen und sichtbar ist.
  // Auf dem Handy startet die Karte verdeckt (Grösse 0), dann wartet das bis zum Umschalten.
  const bounds = boundsOf(located.map((t) => t.location))
  const boundsRef = useRef(bounds)
  useEffect(() => {
    boundsRef.current = bounds
  })
  const fittedRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let handle: MapHandle
    const loadedRef = { current: false }
    function fitOnce() {
      if (fittedRef.current) return
      fittedRef.current = true
      handle.fitTo(boundsRef.current)
    }
    // Wird die Karte sichtbar, erst nach dem Grössenwechsel von maplibre einpassen.
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0
      if (width > 0 && loadedRef.current && !fittedRef.current) requestAnimationFrame(fitOnce)
    })
    observer.observe(container)
    try {
      handle = createMap(container, {
        onLoad: () => {
          loadedRef.current = true
          if (container.clientWidth > 0) fitOnce()
          setLoaded(true)
        },
        onError: () => setFailed(true),
        onClick: (location) => {
          const { placingTask: current, onPlace: place } = placingRef.current
          if (current) place?.(current.id, location)
        },
      })
    } catch {
      // Ohne WebGL oder ohne Netz: Board läuft weiter, die Karte zeigt einen Hinweis.
      observer.disconnect()
      queueMicrotask(() => setFailed(true))
      return
    }
    setMap(handle)
    return () => {
      observer.disconnect()
      handle.remove()
      setMap(null)
    }
  }, [])

  return (
    <section
      aria-label="Karte"
      className="glass flex h-96 min-w-0 flex-col gap-3 rounded-2xl border p-3 lg:h-160"
    >
      <header className="flex flex-wrap items-center justify-between gap-2 px-1">
        <h2 className="font-heading text-lg">Karte</h2>
        <p className="font-mono text-sm text-muted-foreground">{locationSummary(tasks)}</p>
      </header>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-muted">
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: loaded && !failed ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* maplibre setzt eigene Positionierung auf den Container, darum ein eigener Rahmen. */}
          <div ref={containerRef} className="size-full" />
        </motion.div>
        <AnimatePresence>
          {placingTask && (
            <motion.div
              className="glass absolute inset-x-3 top-3 flex items-center gap-3 rounded-xl border p-3 shadow-pop"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            >
              <p role="status" className="flex-1 break-words [overflow-wrap:anywhere] text-sm">
                Klicke auf die Karte, um den Ort für «{placingTask.title}» zu setzen.
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="size-11 shrink-0"
                aria-label="Ort setzen abbrechen"
                onClick={() => onCancelPlacing?.()}
              >
                <X className="size-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
            <MapPinOff aria-hidden className="size-8" />
            <p>Karte gerade nicht erreichbar</p>
          </div>
        )}
      </div>
      <ul className="flex flex-wrap gap-4 px-1 text-sm text-muted-foreground" aria-label="Legende">
        {STATUSES.map((status) => (
          <li key={status} className="flex items-center gap-2">
            <span aria-hidden className={cn('size-3 rounded-full', pinClass(status))} />
            {STATUS_LABELS[status]}
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {map &&
          located.map((task) => (
            <MapPin
              key={task.id}
              map={map}
              task={task}
              selected={task.id === selectedId}
              highlighted={task.id === highlightedId}
              onSelect={onSelect}
            />
          ))}
      </AnimatePresence>
    </section>
  )
}
