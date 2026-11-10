import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { celebrate } from '@/lib/celebrate'
import type { Task } from '@/features/tasks/model'
import { TaskCard } from './TaskCard'

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn() }))

const mockCelebrate = vi.mocked(celebrate)

const task = {
  id: '1',
  title: 'Milch kaufen',
  status: 'todo',
  createdAt: 1,
} satisfies Task
const doneTask: Task = { ...task, status: 'done' }

function props(overrides = {}) {
  return {
    task,
    onToggle: vi.fn(),
    onRemove: vi.fn(),
    onRestore: vi.fn(),
    onStartPlacing: vi.fn(),
    onClearLocation: vi.fn(),
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

  it('starts placing a location when the task has none', async () => {
    const onStartPlacing = vi.fn()
    const user = userEvent.setup()
    render(<TaskCard {...props({ onStartPlacing })} />)
    await user.click(screen.getByRole('button', { name: 'Ort für «Milch kaufen» setzen' }))
    expect(onStartPlacing).toHaveBeenCalledWith('1')
  })

  it('removes the location through the place menu', async () => {
    const onClearLocation = vi.fn()
    const user = userEvent.setup()
    const located: Task = { ...task, location: { lat: 47.37, lng: 8.54 } }
    render(<TaskCard {...props({ task: located, onClearLocation })} />)
    await user.click(screen.getByRole('button', { name: 'Ort für «Milch kaufen» ändern' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Ort entfernen' }))
    expect(onClearLocation).toHaveBeenCalledWith('1')
  })

  it('glows and scrolls into view when selected on the map', () => {
    const scroll = vi.mocked(Element.prototype.scrollIntoView)
    scroll.mockClear()
    const { container } = render(<TaskCard {...props({ selected: true })} />)
    expect(container.firstElementChild).toHaveClass('glow')
    expect(scroll).toHaveBeenCalled()
  })

  it('reports hover and keyboard focus so the map can highlight the pin', () => {
    const onHighlight = vi.fn()
    const { container } = render(<TaskCard {...props({ onHighlight })} />)
    const card = container.firstElementChild!
    fireEvent.mouseEnter(card)
    expect(onHighlight).toHaveBeenLastCalledWith('1')
    fireEvent.mouseLeave(card)
    expect(onHighlight).toHaveBeenLastCalledWith(null)
    fireEvent.focus(screen.getByRole('checkbox'))
    expect(onHighlight).toHaveBeenLastCalledWith('1')
  })

  it('keeps the actions in their own row so the title gets the full width', () => {
    render(<TaskCard {...props()} />)
    const actions = screen.getByRole('group', { name: 'Aktionen für «Milch kaufen»' })
    expect(
      within(actions).getByRole('button', { name: 'Ort für «Milch kaufen» setzen' }),
    ).toBeInTheDocument()
    expect(
      within(actions).getByRole('button', { name: '«Milch kaufen» löschen' }),
    ).toBeInTheDocument()
    expect(within(actions).queryByRole('checkbox')).not.toBeInTheDocument()
  })
})
