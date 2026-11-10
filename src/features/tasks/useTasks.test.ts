import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTasks } from './useTasks'

describe('useTasks', () => {
  it('starts empty and adds a task', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.add('Milch kaufen'))
    expect(result.current.tasks.map((t) => t.title)).toEqual(['Milch kaufen'])
  })

  it('persists tasks so they survive a remount (reload)', () => {
    const { result, unmount } = renderHook(() => useTasks())
    act(() => result.current.add('Milch kaufen'))
    unmount()

    const { result: second } = renderHook(() => useTasks())
    expect(second.current.tasks.map((t) => t.title)).toEqual(['Milch kaufen'])
  })
})
