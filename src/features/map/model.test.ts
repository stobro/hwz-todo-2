import { describe, expect, it } from 'vitest'
import type { Task } from '@/features/tasks/model'
import { boundsOf, locationSummary, pinClass, tasksWithLocation } from './model'

const zurich = { lat: 47.37, lng: 8.54 }
const bern = { lat: 46.95, lng: 7.45 }
const basel = { lat: 47.56, lng: 7.59 }

const tasks: Task[] = [
  { id: 'a', title: 'A', status: 'todo', createdAt: 1, location: zurich },
  { id: 'b', title: 'B', status: 'doing', createdAt: 2, location: bern },
  { id: 'c', title: 'C', status: 'done', createdAt: 3, location: basel },
  { id: 'd', title: 'D', status: 'todo', createdAt: 4 },
  { id: 'e', title: 'E', status: 'done', createdAt: 5 },
]

describe('pinClass', () => {
  it('gives every status its own look colour', () => {
    expect(pinClass('todo')).toContain('bg-primary')
    expect(pinClass('doing')).toContain('bg-secondary')
    expect(pinClass('done')).toContain('bg-accent')
  })
})

describe('locationSummary', () => {
  it('counts tasks with a location', () => {
    expect(locationSummary(tasks)).toBe('3 von 5 mit Ort')
  })

  it('handles an empty list', () => {
    expect(locationSummary([])).toBe('0 von 0 mit Ort')
  })
})

describe('tasksWithLocation', () => {
  it('keeps only tasks with a location', () => {
    expect(tasksWithLocation(tasks).map((t) => t.id)).toEqual(['a', 'b', 'c'])
  })
})

describe('boundsOf', () => {
  it('returns null without locations', () => {
    expect(boundsOf([])).toBeNull()
  })

  it('spans all locations as [west, south, east, north]', () => {
    expect(boundsOf([zurich, bern, basel])).toEqual([7.45, 46.95, 8.54, 47.56])
  })
})
