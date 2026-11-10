import { describe, expect, it } from 'vitest'
import { CURRENT_VERSION, loadState, saveState, type Task } from './storage'

const storageKey = 'hwz-todo'

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Milch',
    done: false,
    createdAt: 1,
    ...overrides,
  }
}

describe('saveState and loadState', () => {
  it('round-trips tasks through localStorage', () => {
    const tasks = [makeTask({ id: 'a', title: 'A' }), makeTask({ id: 'b', title: 'B', done: true })]
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
})
