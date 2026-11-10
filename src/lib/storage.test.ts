import { describe, expect, it } from 'vitest'
import { CURRENT_VERSION, loadState, migrateV1toV2, saveState, type Task } from './storage'

const storageKey = 'hwz-todo'

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Milch',
    status: 'todo',
    createdAt: 1,
    ...overrides,
  }
}

describe('saveState and loadState', () => {
  it('round-trips tasks through localStorage', () => {
    const tasks = [
      makeTask({ id: 'a', title: 'A' }),
      makeTask({ id: 'b', title: 'B', status: 'done', location: { lat: 47.37, lng: 8.54 } }),
    ]
    saveState(tasks)
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks })
  })

  it('returns an empty state when the key is missing', () => {
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty state for broken JSON without throwing', () => {
    localStorage.setItem(storageKey, 'not-json{')
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty state for the wrong shape', () => {
    localStorage.setItem(storageKey, JSON.stringify({ version: CURRENT_VERSION }))
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('drops an invalid location but keeps the task', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 2,
        tasks: [{ id: 'a', title: 'A', status: 'doing', createdAt: 1, location: { lat: 'x' } }],
      }),
    )
    expect(loadState().tasks).toEqual([makeTask({ id: 'a', title: 'A', status: 'doing' })])
  })
})

describe('migration from version 1', () => {
  const v1 = {
    version: 1,
    tasks: [
      { id: 'a', title: 'Milch kaufen', done: false, createdAt: 1 },
      { id: 'b', title: 'Steuern', done: true, createdAt: 2 },
    ],
  }

  it('is at version 2', () => {
    expect(CURRENT_VERSION).toBe(2)
  })

  it('maps done to status without a location', () => {
    expect(migrateV1toV2(v1.tasks)).toEqual([
      { id: 'a', title: 'Milch kaufen', status: 'todo', createdAt: 1 },
      { id: 'b', title: 'Steuern', status: 'done', createdAt: 2 },
    ])
  })

  it('loads real version 1 data from localStorage and keeps every task', () => {
    localStorage.setItem(storageKey, JSON.stringify(v1))
    expect(loadState()).toEqual({
      version: 2,
      tasks: [
        { id: 'a', title: 'Milch kaufen', status: 'todo', createdAt: 1 },
        { id: 'b', title: 'Steuern', status: 'done', createdAt: 2 },
      ],
    })
  })

  it('stores the migrated data as version 2', () => {
    localStorage.setItem(storageKey, JSON.stringify(v1))
    loadState()
    expect(JSON.parse(localStorage.getItem(storageKey)!).version).toBe(2)
  })
})
