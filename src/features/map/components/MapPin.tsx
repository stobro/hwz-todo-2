import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, usePresence } from 'motion/react'
import { MapPin as MapPinIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MapHandle, MarkerHandle } from '@/lib/map'
import { pinClass, type LocatedTask } from '@/features/map/model'

type MapPinProps = {
  map: MapHandle
  task: LocatedTask
  highlighted?: boolean
  selected?: boolean
  onSelect?: (id: string) => void
}

export function MapPin({
  map,
  task,
  highlighted = false,
  selected = false,
  onSelect,
}: MapPinProps) {
  const [element] = useState(() => document.createElement('div'))
  const markerRef = useRef<MarkerHandle | null>(null)
  // Beim Entfernen erst hinausgleiten, dann den Marker von der Karte nehmen.
  const [isPresent, safeToRemove] = usePresence()
  const { lat, lng } = task.location
  const raised = highlighted || selected

  useEffect(() => {
    const marker = map.addMarker(element, { lat, lng })
    markerRef.current = marker
    return () => {
      marker.remove()
      markerRef.current = null
    }
    // Der Marker entsteht einmal pro Karte, der Ort wird unten nachgeführt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, element])

  useEffect(() => {
    markerRef.current?.setLocation({ lat, lng })
  }, [lat, lng])

  return createPortal(
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {selected && (
          <motion.p
            className="glass absolute bottom-full mb-2 w-max max-w-48 rounded-lg border px-3 py-1 text-center text-sm break-words [overflow-wrap:anywhere] shadow-pop"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {task.title}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        aria-label={`Ort von «${task.title}»`}
        aria-pressed={selected}
        data-highlighted={raised}
        className={cn(
          'flex size-11 items-center justify-center rounded-full border-2 border-card shadow-card transition-look',
          pinClass(task.status),
          raised && 'glow',
        )}
        initial={{ scale: 0, y: -16 }}
        animate={
          isPresent
            ? { scale: raised ? 1.3 : 1, y: 0, opacity: 1 }
            : { scale: 0, y: 16, opacity: 0 }
        }
        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        onAnimationComplete={() => {
          if (!isPresent) safeToRemove?.()
        }}
        onClick={(event) => {
          // Klick auf den Pin soll keinen Ort setzen.
          event.stopPropagation()
          onSelect?.(task.id)
        }}
      >
        <MapPinIcon aria-hidden className="size-5" />
      </motion.button>
    </div>,
    element,
  )
}
