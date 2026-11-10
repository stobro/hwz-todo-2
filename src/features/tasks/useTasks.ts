import { useCallback, useState } from 'react'
import { addTask, removeTask, restoreTask, toggleTask, type Task } from './model'
import { loadState, saveState } from '@/lib/storage'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadState().tasks)

  const persist = useCallback((next: Task[]) => {
    setTasks(next)
    saveState(next)
  }, [])

  const add = useCallback(
    (title: string) => {
      const next = addTask(tasks, title)
      if (next !== tasks) persist(next)
    },
    [tasks, persist],
  )

  const toggle = useCallback(
    (id: string) => persist(toggleTask(tasks, id)),
    [tasks, persist],
  )

  const remove = useCallback((id: string) => persist(removeTask(tasks, id)), [tasks, persist])

  const restore = useCallback(
    (task: Task) => persist(restoreTask(tasks, task)),
    [tasks, persist],
  )

  return { tasks, add, toggle, remove, restore }
}
