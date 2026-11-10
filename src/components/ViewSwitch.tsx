import { Map, SquareKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type View = 'board' | 'map'

type ViewSwitchProps = {
  value: View
  onChange: (view: View) => void
  className?: string
}

const OPTIONS = [
  { view: 'board', label: 'Board', Icon: SquareKanban },
  { view: 'map', label: 'Karte', Icon: Map },
] as const

// Rezept 8: unter 1024 px wechselt der Umschalter zwischen Board und Karte.
export function ViewSwitch({ value, onChange, className }: ViewSwitchProps) {
  return (
    <div
      role="group"
      aria-label="Ansicht"
      className={cn('glass flex gap-1 rounded-2xl border p-1 shadow-card', className)}
    >
      {OPTIONS.map(({ view, label, Icon }) => {
        const active = value === view
        return (
          <Button
            key={view}
            type="button"
            variant="ghost"
            aria-pressed={active}
            onClick={() => onChange(view)}
            className={cn(
              'h-11 flex-1 rounded-xl transition-look',
              active &&
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
            )}
          >
            <Icon aria-hidden className="size-5" />
            {label}
          </Button>
        )
      })}
    </div>
  )
}
