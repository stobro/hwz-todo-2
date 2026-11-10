import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskInput } from './TaskInput'

function renderInput(onAdd = vi.fn()) {
  const user = userEvent.setup()
  const view = render(<TaskInput onAdd={onAdd} />)
  return { user, view, onAdd, field: screen.getByLabelText('Neue Aufgabe') }
}

describe('TaskInput', () => {
  it('adds the trimmed title on Enter', async () => {
    const { user, onAdd, field } = renderInput()
    await user.type(field, '  Milch  ')
    await user.keyboard('{Enter}')
    expect(onAdd).toHaveBeenCalledWith('Milch')
  })

  it('adds the title on the Plus button', async () => {
    const { user, onAdd, field } = renderInput()
    await user.type(field, 'Zucker')
    await user.click(screen.getByLabelText('Aufgabe hinzufügen'))
    expect(onAdd).toHaveBeenCalledWith('Zucker')
  })

  it('does nothing for an empty or whitespace input', async () => {
    const { user, onAdd, field } = renderInput()
    await user.type(field, '   ')
    await user.keyboard('{Enter}')
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('focuses the input when N is pressed outside a field', () => {
    render(<TaskInput onAdd={vi.fn()} />)
    const field = screen.getByLabelText('Neue Aufgabe')
    document.body.focus()
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', bubbles: true }))
    expect(field).toHaveFocus()
  })

  it('does not move focus when N is pressed inside the field', () => {
    render(<TaskInput onAdd={vi.fn()} />)
    const field = screen.getByLabelText('Neue Aufgabe')
    field.focus()
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', bubbles: true }))
    expect(field).toHaveFocus()
  })
})
