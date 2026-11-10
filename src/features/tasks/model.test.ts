import { describe, expect, it } from 'vitest'
import {
  addTask,
  clearLocation,
  moveTask,
  removeTask,
  restoreTask,
  setLocation,
  tasksByStatus,
  toggleTask,
  type Task,
} from './model'

describe('addTask', () => {
  it('adds a trimmed task to the front', () => {
    const next = addTask([], '  Milch kaufen  ')
    expect(next).toHaveLength(1)
    expect(next[0].title).toBe('Milch kaufen')
    expect(next[0].status).toBe('todo')
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
  it('flips a task between todo and done', () => {
    const tasks = addTask([], 'Milch')
    const off = toggleTask(tasks, tasks[0].id)
    expect(off[0].status).toBe('done')
    const back = toggleTask(off, tasks[0].id)
    expect(back[0].status).toBe('todo')
  })

  it('marks a doing task as done', () => {
    const tasks = [{ id: 'a', title: 'A', status: 'doing' as const, createdAt: 1 }]
    expect(toggleTask(tasks, 'a')[0].status).toBe('done')
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
      { id: 'a', title: 'A', status: 'todo' as const, createdAt: 1 },
      { id: 'b', title: 'B', status: 'todo' as const, createdAt: 2 },
      { id: 'c', title: 'C', status: 'todo' as const, createdAt: 3 },
    ]
    const removed = removeTask(tasks, 'b')
    expect(removed.map((t) => t.title)).toEqual(['A', 'C'])
    const restored = restoreTask(removed, tasks[1])
    expect(restored.map((t) => t.title)).toEqual(['A', 'B', 'C'])
  })
})

describe('moveTask', () => {
  const tasks: Task[] = [
    { id: 'a', title: 'A', status: 'todo', createdAt: 1 },
    { id: 'b', title: 'B', status: 'todo', createdAt: 2 },
    { id: 'c', title: 'C', status: 'doing', createdAt: 3 },
    { id: 'd', title: 'D', status: 'doing', createdAt: 4 },
  ]
  const column = (list: Task[], status: string) =>
    list.filter((t) => t.status === status).map((t) => t.id)

  it('moves a task to another column at the given index', () => {
    const next = moveTask(tasks, 'a', 'doing', 0)
    expect(next.find((t) => t.id === 'a')?.status).toBe('doing')
    expect(column(next, 'doing')).toEqual(['a', 'c', 'd'])
    expect(column(next, 'todo')).toEqual(['b'])
  })

  it('appends when the index is past the end of the column', () => {
    const next = moveTask(tasks, 'a', 'doing', 99)
    expect(column(next, 'doing')).toEqual(['c', 'd', 'a'])
  })

  it('moves into an empty column', () => {
    const next = moveTask(tasks, 'c', 'done', 0)
    expect(column(next, 'done')).toEqual(['c'])
  })

  it('reorders inside the same column', () => {
    const next = moveTask(tasks, 'b', 'todo', 0)
    expect(column(next, 'todo')).toEqual(['b', 'a'])
  })

  it('returns the same list for an unknown id', () => {
    expect(moveTask(tasks, 'x', 'done', 0)).toBe(tasks)
  })
})

describe('tasksByStatus', () => {
  it('groups tasks into the three columns in order', () => {
    const tasks = [
      { id: 'a', title: 'A', status: 'done' as const, createdAt: 1 },
      { id: 'b', title: 'B', status: 'todo' as const, createdAt: 2 },
    ]
    const groups = tasksByStatus(tasks)
    expect(groups.todo.map((t) => t.id)).toEqual(['b'])
    expect(groups.doing).toEqual([])
    expect(groups.done.map((t) => t.id)).toEqual(['a'])
  })
})

describe('setLocation and clearLocation', () => {
  const tasks: Task[] = [
    { id: 'a', title: 'A', status: 'todo', createdAt: 1 },
    { id: 'b', title: 'B', status: 'todo', createdAt: 2, location: { lat: 1, lng: 2 } },
  ]

  it('sets the location of one task only', () => {
    const next = setLocation(tasks, 'a', { lat: 47.37, lng: 8.54 })
    expect(next[0].location).toEqual({ lat: 47.37, lng: 8.54 })
    expect(next[1]).toBe(tasks[1])
  })

  it('removes the location of one task only', () => {
    const next = clearLocation(tasks, 'b')
    expect(next[1]).not.toHaveProperty('location')
    expect(next[1].title).toBe('B')
    expect(next[0]).toBe(tasks[0])
  })
})
