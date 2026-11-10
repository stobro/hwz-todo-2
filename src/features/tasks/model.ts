import type { Task } from '@/lib/storage'

export type { Task }

export function createTask(title: string): Task {
  return {
    id: crypto.randomUUID(),
    title: title.slice(0, 200),
    done: false,
    createdAt: Date.now(),
  }
}

export function addTask(tasks: Task[], title: string): Task[] {
  const trimmed = title.trim()
  if (trimmed.length === 0) return tasks
  return [createTask(trimmed), ...tasks]
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id)
}

export function restoreTask(tasks: Task[], task: Task): Task[] {
  const index = tasks.findIndex((t) => t.createdAt >= task.createdAt)
  if (index === -1) return [...tasks, task]
  return [...tasks.slice(0, index), task, ...tasks.slice(index)]
}
