import { useEffect, useRef, type FocusEvent, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { MapPinCheck, MapPinPlus, MapPinX, MapPinned, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { celebrate } from '@/lib/celebrate'
import { cn } from '@/lib/utils'
import { isDone, type Task } from '@/features/tasks/model'

type TaskCardProps = {
  task: Task
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onRestore: (task: Task) => void
  // Im Board: Karte ist ein div im sortierbaren li, mit Griff zum Verschieben.
  element?: 'li' | 'div'
  handle?: ReactNode
  // Ort: ohne Ort startet der Knopf das Setzen auf der Karte, mit Ort öffnet er ein Menü.
  onStartPlacing?: (id: string) => void
  onClearLocation?: (id: string) => void
  // Verbindung zur Karte: ausgewählt per Pin-Klick, Hover und Fokus heben den Pin hervor.
  selected?: boolean
  onHighlight?: (id: string | null) => void
}

export function TaskCard({
  task,
  onToggle,
  onRemove,
  onRestore,
  element = 'li',
  handle,
  onStartPlacing,
  onClearLocation,
  selected = false,
  onHighlight,
}: TaskCardProps) {
  const liRef = useRef<HTMLLIElement & HTMLDivElement>(null)
  const Card = element === 'li' ? motion.li : motion.div
  const label = `«${task.title}»`
  const done = isDone(task)

  useEffect(() => {
    if (selected) liRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selected])

  function handleBlur(event: FocusEvent) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onHighlight?.(null)
  }

  function handleChecked(checked: boolean | 'indeterminate') {
    if (checked === true && !done && liRef.current) celebrate(liRef.current)
    onToggle(task.id)
  }

  function handleRemove() {
    const removed = task
    onRemove(task.id)
    toast('Aufgabe gelöscht', {
      action: {
        label: 'Rückgängig',
        onClick: () => onRestore(removed),
      },
      duration: 5000,
    })
  }

  return (
    <Card
      ref={liRef}
      layout={element === 'li'}
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className={cn(
        'group glass flex min-w-0 flex-col gap-2 rounded-xl border p-4 shadow-card transition-look hover:-translate-y-0.5 hover:shadow-pop focus-within:glow',
        selected && 'glow',
      )}
      onMouseEnter={() => onHighlight?.(task.id)}
      onMouseLeave={() => onHighlight?.(null)}
      onFocus={() => onHighlight?.(task.id)}
      onBlur={handleBlur}
    >
      <div className="flex min-w-0 items-start gap-3">
        <Checkbox
          checked={done}
          onCheckedChange={handleChecked}
          className="mt-0.5 size-6 shrink-0 rounded-md transition-look data-[state=checked]:animate-pop data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
          aria-label={`${label} erledigt`}
        />
        <span className="relative min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-base leading-relaxed">
          <span className={done ? 'text-muted-foreground' : undefined}>{task.title}</span>
          <motion.span
            aria-hidden
            className="absolute left-0 top-1/2 h-0.5 w-full origin-left bg-current"
            initial={false}
            animate={{ scaleX: done ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
      </div>
      {/* Zweite Zeile: Griff links, Ort und Löschen rechts. So bleibt der Titel in voller Breite. */}
      <div
        role="group"
        aria-label={`Aktionen für ${label}`}
        className="-m-2 flex items-center gap-1"
      >
        {handle}
        <div className="ml-auto flex items-center gap-1">
          {onStartPlacing &&
            (task.location ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    aria-label={`Ort für ${label} ändern`}
                    className="h-11 gap-1.5 rounded-full px-3 text-sm transition-look"
                  >
                    <span className="flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
                      <MapPinCheck aria-hidden className="size-4" />
                      Ort
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => onStartPlacing(task.id)}>
                    <MapPinned className="size-4" />
                    Ort neu setzen
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onClearLocation?.(task.id)}>
                    <MapPinX className="size-4" />
                    Ort entfernen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                aria-label={`Ort für ${label} setzen`}
                className="h-11 gap-1.5 rounded-full px-3 text-sm text-muted-foreground opacity-70 transition-look group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
                onClick={() => onStartPlacing(task.id)}
              >
                <MapPinPlus aria-hidden className="size-4" />
                Ort
              </Button>
            ))}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`${label} löschen`}
            className="size-11 text-muted-foreground opacity-70 transition-look group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
            onClick={handleRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
