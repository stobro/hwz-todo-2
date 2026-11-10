import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ViewSwitch } from './ViewSwitch'

describe('ViewSwitch', () => {
  it('marks the active view as pressed', () => {
    render(<ViewSwitch value="board" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Board' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Karte' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('reports the chosen view', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ViewSwitch value="board" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Karte' }))
    expect(onChange).toHaveBeenCalledWith('map')
  })
})
