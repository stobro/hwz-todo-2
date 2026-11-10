import { describe, expect, it } from 'vitest'
import { addTask, removeTask, restoreTask, toggleTask } from './model'

describe('addTask', () => {
  it('adds a trimmed task to the front', () => {
    const next = addTask([], '  Milch kaufen  ')
    expect(next).toHaveLength(1)
    expect(next[0].title).toBe('Milch kaufen')
    expect(next[0].done).toBe(false)
  })

  it('ignores empty or whitespace-only titles', () => {
    expect(addTask([], '')).toHaveLength(0)
    expect(addTask([], '   ')).toHaveLength(0)
  })

  it('truncates titles to 200 characters', () => {
    const long = 'x'.repeat(300)
    const next = addTask([], long)
    expect(next[0].title).toHaveLength(200)
  })
})

describe('toggleTask', () => {
  it('flips the done state of a task', () => {
    const tasks = addTask([], 'Milch')
    const off = toggleTask(tasks, tasks[0].id)
    expect(off[0].done).toBe(true)
    const back = toggleTask(off, tasks[0].id)
    expect(back[0].done).toBe(false)
  })

  it('keeps the order unchanged', () => {
    const a = addTask([], 'A')
    const tasks = addTask(a, 'B')
    const off = toggleTask(tasks, tasks[0].id)
    expect(off.map((t) => t.title)).toEqual(['B', 'A'])
  })
})

describe('removeTask and restoreTask', () => {
  it('removes the given task', () => {
    const tasks = addTask([], 'Milch')
    expect(removeTask(tasks, tasks[0].id)).toHaveLength(0)
  })

  it('restores a removed task at its old position', () => {
    const tasks = [
      { id: 'a', title: 'A', done: false, createdAt: 1 },
      { id: 'b', title: 'B', done: false, createdAt: 2 },
      { id: 'c', title: 'C', done: false, createdAt: 3 },
    ]
    const removed = removeTask(tasks, 'b')
    expect(removed.map((t) => t.title)).toEqual(['A', 'C'])
    const restored = restoreTask(removed, tasks[1])
    expect(restored.map((t) => t.title)).toEqual(['A', 'B', 'C'])
  })
})
