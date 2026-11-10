import { MotionConfig } from 'motion/react'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useTasks } from '@/features/tasks/useTasks'
import { TaskInput } from '@/features/tasks/components/TaskInput'
import { TaskList } from '@/features/tasks/components/TaskList'
import { EmptyState } from '@/features/tasks/components/EmptyState'
import { ProgressRing } from '@/components/ProgressRing'

function today(): string {
  return new Intl.DateTimeFormat('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

export default function App() {
  const { tasks, add, toggle, remove, restore } = useTasks()
  const total = tasks.length
  const done = tasks.filter((t) => t.done).length

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
          <header className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-gradient font-heading text-5xl font-bold tracking-tight sm:text-6xl">
                Meine Aufgaben
              </h1>
              <p className="mt-2 text-muted-foreground">{today()}</p>
            </div>
            <ProgressRing done={done} total={total} />
          </header>
          <TaskInput onAdd={add} />
          {total === 0 ? <EmptyState /> : (
            <TaskList tasks={tasks} onToggle={toggle} onRemove={remove} onRestore={restore} />
          )}
        </main>
        <Toaster position="bottom-center" richColors closeButton />
      </TooltipProvider>
    </MotionConfig>
  )
}
