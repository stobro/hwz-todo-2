import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProgressRing } from './ProgressRing'

describe('ProgressRing', () => {
  it('shows the ratio and a German aria-label', () => {
    render(<ProgressRing done={1} total={2} />)
    expect(screen.getByRole('img', { name: '1 von 2 erledigt' })).toBeInTheDocument()
    expect(screen.getByText('1/2')).toBeInTheDocument()
  })

  it('shows 0/0 when there are no tasks', () => {
    render(<ProgressRing done={0} total={0} />)
    expect(screen.getByRole('img', { name: '0 von 0 erledigt' })).toBeInTheDocument()
    expect(screen.getByText('0/0')).toBeInTheDocument()
  })
})
