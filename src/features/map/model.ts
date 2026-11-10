import type { Location, Task, TaskStatus } from '@/features/tasks/model'

// [West, Süd, Ost, Nord] wie bei maplibre-gl.
export type Bounds = [number, number, number, number]

const PIN_CLASSES: Record<TaskStatus, string> = {
  todo: 'bg-primary text-primary-foreground',
  doing: 'bg-secondary text-secondary-foreground',
  done: 'bg-accent text-accent-foreground',
}

export function pinClass(status: TaskStatus): string {
  return PIN_CLASSES[status]
}

export type LocatedTask = Task & { location: Location }

export function tasksWithLocation(tasks: Task[]): LocatedTask[] {
  return tasks.filter((t): t is LocatedTask => t.location !== undefined)
}

export function locationSummary(tasks: Task[]): string {
  return `${tasksWithLocation(tasks).length} von ${tasks.length} mit Ort`
}

export function boundsOf(locations: Location[]): Bounds | null {
  if (locations.length === 0) return null
  const lngs = locations.map((l) => l.lng)
  const lats = locations.map((l) => l.lat)
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)]
}
