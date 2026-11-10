import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('shows the hero title «Terra»', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Terra')
  })

  it.each(['aurora', 'candy', 'neon'])('renders with look %s', (look) => {
    document.documentElement.dataset.look = look
    render(<App />)
    expect(document.documentElement).toHaveAttribute('data-look', look)
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
  })

  it('switches between board and map on narrow screens', async () => {
    const user = userEvent.setup()
    render(<App />)
    const board = screen.getByTestId('board-view')
    const map = screen.getByTestId('map-view')
    expect(map).toHaveClass('hidden')
    await user.click(screen.getByRole('button', { name: 'Karte' }))
    expect(screen.getByRole('button', { name: 'Karte' })).toHaveAttribute('aria-pressed', 'true')
    expect(map).not.toHaveClass('hidden')
    expect(board).toHaveClass('hidden')
  })
})
