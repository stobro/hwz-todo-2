export type TaskStatus = 'todo' | 'doing' | 'done'

export type Location = {
  lat: number // −90 bis 90
  lng: number // −180 bis 180
}

export type Task = {
  id: string // crypto.randomUUID()
  title: string // getrimmt, 1 bis 200 Zeichen
  status: TaskStatus
  createdAt: number // Date.now()
  location?: Location
}

export type TaskV1 = {
  id: string
  title: string
  done: boolean
  createdAt: number
}

export type State = { version: number; tasks: Task[] }

export const CURRENT_VERSION = 2
export const STORAGE_KEY = 'hwz-todo'

const STATUSES: readonly TaskStatus[] = ['todo', 'doing', 'done']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function hasBaseFields(t: Record<string, unknown>): boolean {
  return typeof t.id === 'string' && typeof t.title === 'string' && typeof t.createdAt === 'number'
}

function isTaskV1(value: unknown): value is TaskV1 {
  return isRecord(value) && hasBaseFields(value) && typeof value.done === 'boolean'
}

export function isLocation(value: unknown): value is Location {
  if (!isRecord(value)) return false
  const { lat, lng } = value
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  )
}

// Liest eine Aufgabe der Version 2. Ein ungültiger Ort wird verworfen, die Aufgabe bleibt.
function parseTaskV2(value: unknown): Task | null {
  if (!isRecord(value) || !hasBaseFields(value)) return null
  if (!STATUSES.includes(value.status as TaskStatus)) return null
  const task: Task = {
    id: value.id as string,
    title: value.title as string,
    status: value.status as TaskStatus,
    createdAt: value.createdAt as number,
  }
  if (isLocation(value.location))
    task.location = { lat: value.location.lat, lng: value.location.lng }
  return task
}

export function migrateV1toV2(tasks: TaskV1[]): Task[] {
  return tasks.map(({ id, title, done, createdAt }) => ({
    id,
    title,
    status: done ? 'done' : 'todo',
    createdAt,
  }))
}

function empty(): State {
  return { version: CURRENT_VERSION, tasks: [] }
}

export function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return empty()
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || !Array.isArray(parsed.tasks)) return empty()
    const { tasks, version } = parsed as { tasks: unknown[]; version?: unknown }

    if (version === 1 || (version === undefined && tasks.every(isTaskV1))) {
      if (!tasks.every(isTaskV1)) return empty()
      const migrated = migrateV1toV2(tasks)
      saveState(migrated)
      return { version: CURRENT_VERSION, tasks: migrated }
    }

    const parsedTasks = tasks.map(parseTaskV2)
    if (parsedTasks.some((t) => t === null)) return empty()
    return { version: CURRENT_VERSION, tasks: parsedTasks as Task[] }
  } catch {
    return empty()
  }
}

export function saveState(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CURRENT_VERSION, tasks }))
}
