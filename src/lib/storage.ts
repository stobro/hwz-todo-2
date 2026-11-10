export type Task = {
  id: string // crypto.randomUUID()
  title: string // getrimmt, 1 bis 200 Zeichen
  done: boolean
  createdAt: number // Date.now()
}

export type State = { version: number; tasks: Task[] }

export const CURRENT_VERSION = 1
export const STORAGE_KEY = 'hwz-todo'

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.done === 'boolean' &&
    typeof t.createdAt === 'number'
  )
}

export function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return { version: CURRENT_VERSION, tasks: [] }
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) {
      return { version: CURRENT_VERSION, tasks: [] }
    }
    const { tasks } = parsed as { tasks?: unknown }
    if (!Array.isArray(tasks) || !tasks.every(isTask)) {
      return { version: CURRENT_VERSION, tasks: [] }
    }
    // Aktuelle Version: keine Migration nötig.
    return { version: CURRENT_VERSION, tasks }
  } catch {
    return { version: CURRENT_VERSION, tasks: [] }
  }
}

export function saveState(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CURRENT_VERSION, tasks }))
}
