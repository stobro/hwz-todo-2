import { useRef } from 'react'
import { motion } from 'motion/react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { celebrate } from '@/lib/celebrate'
import type { Task } from '@/features/tasks/model'

type TaskCardProps = {
  task: Task
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onRestore: (task: Task) => void
}

export function TaskCard({ task, onToggle, onRemove, onRestore }: TaskCardProps) {
  const liRef = useRef<HTMLLIElement>(null)
  const label = `«${task.title}»`

  function handleChecked(checked: boolean | 'indeterminate') {
    if (checked === true && !task.done && liRef.current) celebrate(liRef.current)
    onToggle(task.id)
  }

  function handleRemove() {
    const removed = task
    onRemove(task.id)
    toast('Aufgabe gelöscht', {
      action: {
        label: 'Rückgängig',
        onClick: () => onRestore(removed),
      },
      duration: 5000,
    })
  }

  return (
    <motion.li
      ref={liRef}
      layout
      className="group glass flex items-start gap-3 rounded-xl border p-4 shadow-card transition-look hover:-translate-y-0.5 hover:shadow-pop focus-within:glow"
    >
      <Checkbox
        checked={task.done}
        onCheckedChange={handleChecked}
        className="mt-0.5 size-6 rounded-md transition-look data-[state=checked]:animate-pop data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
        aria-label={`${label} erledigt`}
      />
      <span className="relative flex-1 break-words [overflow-wrap:anywhere] text-base leading-relaxed">
        <span className={task.done ? 'text-muted-foreground' : undefined}>{task.title}</span>
        <motion.span
          aria-hidden
          className="absolute left-0 top-1/2 h-0.5 w-full origin-left bg-current"
          initial={false}
          animate={{ scaleX: task.done ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`${label} löschen`}
        className="opacity-60 transition-look group-hover:opacity-100 focus-visible:opacity-100"
        onClick={handleRemove}
      >
        <Trash2 className="size-4" />
      </Button>
    </motion.li>
  )
}
