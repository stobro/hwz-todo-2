import { useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useTasks } from '@/features/tasks/useTasks'
import { isDone } from '@/features/tasks/model'
import { TaskInput } from '@/features/tasks/components/TaskInput'
import { Board } from '@/features/tasks/components/Board'
import { EmptyState } from '@/features/tasks/components/EmptyState'
import { ProgressRing } from '@/components/ProgressRing'
import { ViewSwitch, type View } from '@/components/ViewSwitch'
import { cn } from '@/lib/utils'
import { TaskMap } from '@/features/map/components/TaskMap'

function today(): string {
  return new Intl.DateTimeFormat('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

export default function App() {
  const { tasks, add, toggle, remove, restore, move, place, unplace } = useTasks()
  const [placingId, setPlacingId] = useState<string | null>(null)
  const placingTask = tasks.find((t) => t.id === placingId) ?? null
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [view, setView] = useState<View>('board')

  // Auf schmalen Bildschirmen zeigt jede Aktion die passende Ansicht.
  function startPlacing(id: string) {
    setPlacingId(id)
    setView('map')
  }

  function selectFromMap(id: string) {
    setSelectedId(id)
    setView('board')
  }

  // Ein Pin-Klick lässt die Karte im Board kurz aufleuchten.
  useEffect(() => {
    if (!selectedId) return
    const timer = window.setTimeout(() => setSelectedId(null), 2500)
    return () => window.clearTimeout(timer)
  }, [selectedId])
  const total = tasks.length
  const done = tasks.filter(isDone).length

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-16">
          <header className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-gradient font-heading text-4xl font-bold tracking-tight sm:text-6xl">
                Terra
              </h1>
              <p className="mt-2 text-muted-foreground">{today()}</p>
            </div>
            <ProgressRing done={done} total={total} />
          </header>
          <TaskInput onAdd={add} />
          <ViewSwitch value={view} onChange={setView} className="lg:hidden" />
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            <div
              data-testid="board-view"
              className={cn('min-w-0 lg:col-span-2 lg:block', view === 'map' && 'hidden')}
            >
              {total === 0 ? (
                <EmptyState />
              ) : (
                <Board
                  tasks={tasks}
                  onMove={move}
                  onToggle={toggle}
                  onRemove={remove}
                  onRestore={restore}
                  onStartPlacing={startPlacing}
                  onClearLocation={unplace}
                  selectedId={selectedId}
                  onHighlight={setHighlightedId}
                />
              )}
            </div>
            <div
              data-testid="map-view"
              className={cn('min-w-0 lg:sticky lg:top-6 lg:block', view === 'board' && 'hidden')}
            >
              <TaskMap
                tasks={tasks}
                placingTask={placingTask}
                onPlace={(id, location) => {
                  place(id, location)
                  setPlacingId(null)
                }}
                onCancelPlacing={() => setPlacingId(null)}
                selectedId={selectedId}
                highlightedId={highlightedId}
                onSelect={selectFromMap}
              />
            </div>
          </div>
        </main>
        <Toaster position="bottom-center" richColors closeButton />
      </TooltipProvider>
    </MotionConfig>
  )
}
