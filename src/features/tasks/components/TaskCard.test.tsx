import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { celebrate } from '@/lib/celebrate'
import { TaskCard } from './TaskCard'

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn() }))

const mockCelebrate = vi.mocked(celebrate)

const task = {
  id: '1',
  title: 'Milch kaufen',
  done: false,
  createdAt: 1,
}
const doneTask = { ...task, done: true }

function props(overrides = {}) {
  return {
    task,
    onToggle: vi.fn(),
    onRemove: vi.fn(),
    onRestore: vi.fn(),
    ...overrides,
  }
}

describe('TaskCard', () => {
  beforeEach(() => mockCelebrate.mockClear())

  it('shows the title, a checkbox and a delete button', () => {
    render(<TaskCard {...props()} />)
    expect(screen.getByText('Milch kaufen')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: '«Milch kaufen» erledigt' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '«Milch kaufen» löschen' })).toBeInTheDocument()
  })

  it('toggles the task and celebrates when checked', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    render(<TaskCard {...props({ onToggle })} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('1')
    expect(mockCelebrate).toHaveBeenCalled()
  })

  it('does not celebrate when unchecking an already done task', async () => {
    const user = userEvent.setup()
    render(<TaskCard {...props({ task: doneTask })} />)
    await user.click(screen.getByRole('checkbox'))
    expect(mockCelebrate).not.toHaveBeenCalled()
  })

  it('calls onRemove when the delete button is clicked', async () => {
    const onRemove = vi.fn()
    const user = userEvent.setup()
    render(<TaskCard {...props({ onRemove })} />)
    await user.click(screen.getByRole('button', { name: '«Milch kaufen» löschen' }))
    expect(onRemove).toHaveBeenCalledWith('1')
  })
})
