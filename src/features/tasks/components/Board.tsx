import { useRef, useState, type KeyboardEventHandler, type PointerEventHandler } from 'react'
import { AnimatePresence } from 'motion/react'
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { celebrate } from '@/lib/celebrate'
import { cn } from '@/lib/utils'
import {
  STATUS_LABELS,
  STATUSES,
  tasksByStatus,
  type Task,
  type TaskStatus,
} from '@/features/tasks/model'
import { TaskCard } from './TaskCard'

type BoardProps = {
  tasks: Task[]
  onMove: (id: string, toStatus: TaskStatus, toIndex: number) => void
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onRestore: (task: Task) => void
  onStartPlacing?: (id: string) => void
  onClearLocation?: (id: string) => void
  selectedId?: string | null
  onHighlight?: (id: string | null) => void
}

function isStatus(id: UniqueIdentifier): id is TaskStatus {
  return (STATUSES as readonly UniqueIdentifier[]).includes(id)
}

export function Board({
  tasks,
  onMove,
  onToggle,
  onRemove,
  onRestore,
  onStartPlacing,
  onClearLocation,
  selectedId = null,
  onHighlight,
}: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null)
  const columnRefs = useRef<Partial<Record<TaskStatus, HTMLElement | null>>>({})
  const groups = tasksByStatus(tasks)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function titleOf(id: UniqueIdentifier): string {
    return tasks.find((t) => t.id === id)?.title ?? ''
  }

  // Ziel einer Bewegung: Spalte und Stelle innerhalb der Spalte.
  function targetOf(overId: UniqueIdentifier): { status: TaskStatus; index: number } | null {
    if (isStatus(overId)) return { status: overId, index: groups[overId].length }
    const over = tasks.find((t) => t.id === overId)
    if (!over) return null
    return { status: over.status, index: groups[over.status].indexOf(over) }
  }

  function columnName(overId: UniqueIdentifier | undefined): string {
    if (overId === undefined) return ''
    const target = targetOf(overId)
    return target ? STATUS_LABELS[target.status] : ''
  }

  const announcements: Announcements = {
    onDragStart: ({ active }) => `«${titleOf(active.id)}» aufgenommen.`,
    onDragOver: ({ active, over }) =>
      over
        ? `«${titleOf(active.id)}» ist über der Spalte «${columnName(over.id)}».`
        : `«${titleOf(active.id)}» ist über keiner Spalte.`,
    onDragEnd: ({ active, over }) =>
      over
        ? `«${titleOf(active.id)}» in «${columnName(over.id)}» abgelegt.`
        : `«${titleOf(active.id)}» abgelegt.`,
    onDragCancel: ({ active }) => `Verschieben von «${titleOf(active.id)}» abgebrochen.`,
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id))
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverStatus(over ? (targetOf(over.id)?.status ?? null) : null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    setOverStatus(null)
    if (!over) return
    const task = tasks.find((t) => t.id === active.id)
    const target = targetOf(over.id)
    if (!task || !target) return
    onMove(task.id, target.status, target.index)
    const column = columnRefs.current[target.status]
    if (target.status === 'done' && task.status !== 'done' && column) celebrate(column)
  }

  function handleDragCancel() {
    setActiveId(null)
    setOverStatus(null)
  }

  const active = tasks.find((t) => t.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable:
            'Leertaste greift die Karte. Pfeiltasten bewegen sie, Leertaste legt sie ab, Esc bricht ab.',
        },
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="-mx-4 -my-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-2 pb-4 md:mx-0 md:my-0 md:grid md:grid-cols-3 md:overflow-visible md:p-0">
        {STATUSES.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            tasks={groups[status]}
            highlighted={overStatus === status}
            columnRef={(el) => {
              columnRefs.current[status] = el
            }}
            onToggle={onToggle}
            onRemove={onRemove}
            onRestore={onRestore}
            onStartPlacing={onStartPlacing}
            onClearLocation={onClearLocation}
            selectedId={selectedId}
            onHighlight={onHighlight}
          />
        ))}
      </div>
      <DragOverlay>
        {active ? (
          <div className="glass flex min-w-0 items-start gap-3 rounded-xl border p-4 shadow-pop rotate-2">
            <span className="flex-1 break-words [overflow-wrap:anywhere] text-base leading-relaxed">
              {active.title}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

type CardActions = {
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onRestore: (task: Task) => void
  onStartPlacing?: (id: string) => void
  onClearLocation?: (id: string) => void
  onHighlight?: (id: string | null) => void
}

type BoardColumnProps = CardActions & {
  status: TaskStatus
  tasks: Task[]
  highlighted: boolean
  selectedId: string | null
  columnRef: (el: HTMLElement | null) => void
}

function BoardColumn({
  status,
  tasks,
  highlighted,
  columnRef,
  selectedId,
  ...actions
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const headingId = `column-${status}`

  return (
    <section
      ref={(el) => {
        setNodeRef(el)
        columnRef(el)
      }}
      aria-labelledby={headingId}
      className={cn(
        'glass flex min-h-64 w-[85vw] min-w-0 shrink-0 snap-center flex-col gap-3 rounded-2xl border p-3 transition-look md:w-auto',
        (isOver || highlighted) && 'glow scale-[1.01]',
      )}
    >
      <header className="flex items-center justify-between gap-2 px-1">
        <h2 id={headingId} className="font-heading text-lg">
          {STATUS_LABELS[status]}
        </h2>
        <Badge variant="secondary" className="font-mono">
          {tasks.length}
        </Badge>
      </header>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-ring/60 p-6 text-center text-muted-foreground">
            Hierher ziehen
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            <AnimatePresence initial={false} mode="popLayout">
              {tasks.map((task) => (
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  selected={task.id === selectedId}
                  {...actions}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </SortableContext>
    </section>
  )
}

type SortableTaskCardProps = CardActions & {
  task: Task
  selected: boolean
}

function SortableTaskCard({ task, selected, ...actions }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, attributes: { roleDescription: 'verschiebbare Karte' } })
  // Maus und Finger ziehen die ganze Karte, die Tastatur nur über den Griff.
  const onPointerDown = listeners?.onPointerDown as PointerEventHandler | undefined
  const onKeyDown = listeners?.onKeyDown as KeyboardEventHandler | undefined

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('min-w-0 touch-manipulation', isDragging && 'opacity-50')}
      onPointerDown={onPointerDown}
    >
      <TaskCard
        element="div"
        task={task}
        selected={selected}
        {...actions}
        handle={
          <button
            ref={setActivatorNodeRef}
            type="button"
            {...attributes}
            onKeyDown={onKeyDown}
            aria-label={`«${task.title}» verschieben`}
            className="flex size-11 shrink-0 cursor-grab touch-none items-center justify-center rounded-full text-muted-foreground transition-look hover:bg-muted hover:text-foreground active:cursor-grabbing"
          >
            <GripVertical className="size-5" />
          </button>
        }
      />
    </li>
  )
}
