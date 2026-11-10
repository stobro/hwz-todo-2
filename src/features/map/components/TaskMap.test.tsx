import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Task } from '@/features/tasks/model'
import { createMap, type MapHandle, type MapOptions } from '@/lib/map'
import { TaskMap } from './TaskMap'

// maplibre-gl braucht WebGL, das jsdom nicht kennt: Marker landen direkt im Dokument.
vi.mock('@/lib/map', () => ({
  createMap: vi.fn(),
}))

const mockCreateMap = vi.mocked(createMap)
let options: MapOptions
let fitTo: ReturnType<typeof vi.fn<MapHandle['fitTo']>>

beforeEach(() => {
  mockCreateMap.mockReset()
  fitTo = vi.fn<MapHandle['fitTo']>()
  mockCreateMap.mockImplementation((_container, opts) => {
    options = opts
    return {
      addMarker: (element: HTMLElement) => {
        document.body.appendChild(element)
        return { setLocation: vi.fn(), remove: () => element.remove() }
      },
      fitTo,
      setPlacing: vi.fn(),
      remove: vi.fn(),
    }
  })
})

const tasks: Task[] = [
  {
    id: 'a',
    title: 'Milch kaufen',
    status: 'todo',
    createdAt: 1,
    location: { lat: 47.37, lng: 8.54 },
  },
  { id: 'b', title: 'Steuern', status: 'done', createdAt: 2, location: { lat: 46.95, lng: 7.45 } },
  {
    id: 'c',
    title: 'Velo putzen',
    status: 'doing',
    createdAt: 3,
    location: { lat: 47.56, lng: 7.59 },
  },
  { id: 'd', title: 'Anrufen', status: 'todo', createdAt: 4 },
  { id: 'e', title: 'Lesen', status: 'done', createdAt: 5 },
]

describe('TaskMap', () => {
  it('shows how many tasks have a location', () => {
    render(<TaskMap tasks={tasks} />)
    expect(screen.getByText('3 von 5 mit Ort')).toBeInTheDocument()
  })

  it('renders one pin per task with a location, coloured by status', () => {
    render(<TaskMap tasks={tasks} />)
    expect(screen.getAllByRole('button', { name: /^Ort von/ })).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Ort von «Steuern»' })).toHaveClass('bg-accent')
  })

  it('recolours a pin when the status changes, without reload', () => {
    const { rerender } = render(<TaskMap tasks={tasks} />)
    const moved = tasks.map((t): Task => (t.id === 'a' ? { ...t, status: 'done' } : t))
    rerender(<TaskMap tasks={moved} />)
    expect(screen.getByRole('button', { name: 'Ort von «Milch kaufen»' })).toHaveClass('bg-accent')
  })

  it('shows a hint when the map cannot load', () => {
    render(<TaskMap tasks={tasks} />)
    act(() => options.onError())
    expect(screen.getByText('Karte gerade nicht erreichbar')).toBeInTheDocument()
  })

  it('shows a hint when the map cannot be created at all', async () => {
    mockCreateMap.mockImplementation(() => {
      throw new Error('no WebGL')
    })
    render(<TaskMap tasks={tasks} />)
    expect(await screen.findByText('Karte gerade nicht erreichbar')).toBeInTheDocument()
  })

  it('never shows a spinner or progress bar', () => {
    render(<TaskMap tasks={tasks} />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.queryByText(/lädt/i)).not.toBeInTheDocument()
  })

  it('shows the placing hint and places the task on map click', () => {
    const onPlace = vi.fn()
    render(
      <TaskMap tasks={tasks} placingTask={tasks[3]} onPlace={onPlace} onCancelPlacing={vi.fn()} />,
    )
    expect(
      screen.getByText('Klicke auf die Karte, um den Ort für «Anrufen» zu setzen.'),
    ).toBeInTheDocument()
    act(() => options.onClick({ lat: 47, lng: 8 }))
    expect(onPlace).toHaveBeenCalledWith('d', { lat: 47, lng: 8 })
  })

  it('ignores map clicks when not placing', () => {
    const onPlace = vi.fn()
    render(<TaskMap tasks={tasks} onPlace={onPlace} />)
    act(() => options.onClick({ lat: 47, lng: 8 }))
    expect(onPlace).not.toHaveBeenCalled()
  })

  it('cancels placing with Esc', async () => {
    const onCancelPlacing = vi.fn()
    const user = userEvent.setup()
    render(<TaskMap tasks={tasks} placingTask={tasks[3]} onCancelPlacing={onCancelPlacing} />)
    await user.keyboard('{Escape}')
    expect(onCancelPlacing).toHaveBeenCalled()
  })

  it('selects the task when its pin is clicked and shows the title', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    const { rerender } = render(<TaskMap tasks={tasks} onSelect={onSelect} />)
    await user.click(screen.getByRole('button', { name: 'Ort von «Steuern»' }))
    expect(onSelect).toHaveBeenCalledWith('b')
    rerender(<TaskMap tasks={tasks} onSelect={onSelect} selectedId="b" />)
    expect(screen.getByText('Steuern')).toBeInTheDocument()
  })

  it('highlights the pin of the hovered or focused card', () => {
    const { rerender } = render(<TaskMap tasks={tasks} />)
    const pin = () => screen.getByRole('button', { name: 'Ort von «Milch kaufen»' })
    expect(pin()).toHaveAttribute('data-highlighted', 'false')
    rerender(<TaskMap tasks={tasks} highlightedId="a" />)
    expect(pin()).toHaveAttribute('data-highlighted', 'true')
  })

  it('fits all pins once the map becomes visible (hidden at start on phones)', async () => {
    let notify: ResizeObserverCallback = () => {}
    const original = globalThis.ResizeObserver
    globalThis.ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) {
        notify = callback
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver

    try {
      render(<TaskMap tasks={tasks} />)
      act(() => options.onLoad())
      expect(fitTo).not.toHaveBeenCalled()

      act(() =>
        notify(
          [{ contentRect: { width: 320, height: 300 } } as ResizeObserverEntry],
          {} as ResizeObserver,
        ),
      )
      await waitFor(() => expect(fitTo).toHaveBeenCalledWith([7.45, 46.95, 8.54, 47.56]))
    } finally {
      globalThis.ResizeObserver = original
    }
  })
})
