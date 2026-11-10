import type { Location, Task, TaskStatus } from '@/lib/storage'

export type { Location, Task, TaskStatus }

export function createTask(title: string): Task {
  return {
    id: crypto.randomUUID(),
    title: title.slice(0, 200),
    status: 'todo',
    createdAt: Date.now(),
  }
}

export function addTask(tasks: Task[], title: string): Task[] {
  const trimmed = title.trim()
  if (trimmed.length === 0) return tasks
  return [createTask(trimmed), ...tasks]
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task,
  )
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id)
}

export function restoreTask(tasks: Task[], task: Task): Task[] {
  const index = tasks.findIndex((t) => t.createdAt >= task.createdAt)
  if (index === -1) return [...tasks, task]
  return [...tasks.slice(0, index), task, ...tasks.slice(index)]
}

export function isDone(task: Task): boolean {
  return task.status === 'done'
}

export const STATUSES: readonly TaskStatus[] = ['todo', 'doing', 'done']

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Offen',
  doing: 'In Arbeit',
  done: 'Erledigt',
}

export function tasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const groups: Record<TaskStatus, Task[]> = { todo: [], doing: [], done: [] }
  for (const task of tasks) groups[task.status].push(task)
  return groups
}

// Verschiebt eine Aufgabe in die Spalte toStatus an die Stelle toIndex (innerhalb der Spalte).
export function moveTask(tasks: Task[], id: string, toStatus: TaskStatus, toIndex: number): Task[] {
  const task = tasks.find((t) => t.id === id)
  if (!task) return tasks
  const rest = tasks.filter((t) => t.id !== id)
  const moved: Task = { ...task, status: toStatus }
  const column = rest.filter((t) => t.status === toStatus)
  const index = Math.max(0, toIndex)

  if (index < column.length) {
    const at = rest.indexOf(column[index])
    return [...rest.slice(0, at), moved, ...rest.slice(at)]
  }
  if (column.length > 0) {
    const at = rest.indexOf(column[column.length - 1]) + 1
    return [...rest.slice(0, at), moved, ...rest.slice(at)]
  }
  return [...rest, moved]
}

export function setLocation(tasks: Task[], id: string, location: Location): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, location: { lat: location.lat, lng: location.lng } } : task,
  )
}

export function clearLocation(tasks: Task[], id: string): Task[] {
  return tasks.map((task) => {
    if (task.id !== id) return task
    const rest = { ...task }
    delete rest.location
    return rest
  })
}
