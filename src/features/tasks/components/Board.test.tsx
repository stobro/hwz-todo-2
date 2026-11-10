import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Task } from '@/features/tasks/model'
import { Board } from './Board'

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn() }))

const tasks: Task[] = [
  { id: 'a', title: 'Milch kaufen', status: 'todo', createdAt: 1 },
  { id: 'b', title: 'Steuern', status: 'doing', createdAt: 2 },
  { id: 'c', title: 'Velo putzen', status: 'todo', createdAt: 3 },
]

function renderBoard() {
  return render(
    <Board
      tasks={tasks}
      onMove={vi.fn()}
      onToggle={vi.fn()}
      onRemove={vi.fn()}
      onRestore={vi.fn()}
    />,
  )
}

describe('Board', () => {
  it('shows the three columns in order with their counts', () => {
    renderBoard()
    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings.map((h) => h.textContent)).toEqual(['Offen', 'In Arbeit', 'Erledigt'])

    const todo = screen.getByRole('region', { name: 'Offen' })
    expect(within(todo).getByText('2')).toBeInTheDocument()
    expect(within(todo).getByText('Milch kaufen')).toBeInTheDocument()
    expect(
      within(screen.getByRole('region', { name: 'In Arbeit' })).getByText('1'),
    ).toBeInTheDocument()
  })

  it('shows a drop area in an empty column', () => {
    renderBoard()
    const done = screen.getByRole('region', { name: 'Erledigt' })
    expect(within(done).getByText('Hierher ziehen')).toBeInTheDocument()
  })

  it('gives every card a keyboard drag handle', () => {
    renderBoard()
    expect(screen.getByRole('button', { name: '«Steuern» verschieben' })).toBeInTheDocument()
  })
})
