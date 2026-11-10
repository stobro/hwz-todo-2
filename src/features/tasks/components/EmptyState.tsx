export function EmptyState() {
  return (
    <div className="glass flex flex-col items-center gap-4 rounded-2xl border border-dashed p-10 text-center">
      <svg
        viewBox="0 0 120 120"
        aria-hidden
        className="w-[120px] h-[120px]"
      >
        {/* Candy: lächelnde Wolke */}
        <g className="hidden [[data-look=candy]_&]:block">
          <path
            className="fill-accent/80"
            d="M28 72 a24 24 0 0 1 8-46 a30 30 0 0 1 58 4 a22 22 0 0 1-6 42 z"
          />
          <circle cx="46" cy="56" r="4.5" className="fill-card-foreground" />
          <circle cx="74" cy="56" r="4.5" className="fill-card-foreground" />
          <path
            d="M52 70 q8 8 16 0"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="text-card-foreground"
          />
        </g>
        {/* Aurora: Mond mit drei Sternen */}
        <g className="hidden [[data-look=aurora]_&]:block">
          <path
            className="fill-accent"
            d="M70 22 a32 32 0 1 0 30 44 a38 38 0 0 1-30-44 z"
          />
          <circle cx="28" cy="30" r="3" className="fill-primary animate-pulse" />
          <circle cx="92" cy="42" r="2.5" className="fill-primary animate-pulse" />
          <circle cx="78" cy="18" r="4" className="fill-primary animate-pulse" />
        </g>
        {/* Neon: Blitz in einem Kreis */}
        <g className="hidden [[data-look=neon]_&]:block">
          <circle cx="60" cy="60" r="34" className="fill-transparent stroke-primary glow" strokeWidth="3" />
          <polygon className="fill-accent" points="66,32 44,64 60,66 54,92 78,56 62,54" />
        </g>
      </svg>
      <p className="font-heading text-xl">Alles erledigt. Zeit für Kaffee.</p>
      <p className="text-muted-foreground">Tippe oben eine neue Aufgabe ein oder drücke N.</p>
    </div>
  )
}
