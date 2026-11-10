import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('shows the friendly empty message', () => {
    render(<EmptyState />)
    expect(screen.getByText('Alles erledigt. Zeit für Kaffee.')).toBeInTheDocument()
  })
})
