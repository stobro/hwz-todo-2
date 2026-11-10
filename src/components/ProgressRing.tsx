import { motion } from 'motion/react'

type ProgressRingProps = {
  done: number
  total: number
}

const RADIUS = 30
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ProgressRing({ done, total }: ProgressRingProps) {
  const ratio = total > 0 ? done / total : 0
  const dashoffset = CIRCUMFERENCE * (1 - ratio)

  return (
    <div
      role="img"
      aria-label={`${done} von ${total} erledigt`}
      className="relative size-[72px]"
    >
      <svg viewBox="0 0 72 72" className="size-full -rotate-90">
        <circle
          cx="36"
          cy="36"
          r={RADIUS}
          strokeWidth={8}
          fill="none"
          className="stroke-muted"
        />
        <motion.circle
          cx="36"
          cy="36"
          r={RADIUS}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          className="stroke-accent"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold">
        {done}/{total}
      </span>
    </div>
  )
}
