# PLAN: Wie die App gebaut wird

Diese Datei füllt /plan aus docs/SPEC.md.

## Stack

Siehe docs/STACK.md. Keine Abweichungen.

## Ordner und Dateien

- `src/features/tasks/model.ts`: Typ Task und reine Funktionen addTask, toggleTask, removeTask, restoreTask.
- `src/features/tasks/model.test.ts`: Tests für das Datenmodell (leere Eingabe, 200 Zeichen, abhaken, löschen).
- `src/lib/storage.ts`: localStorage lesen, schreiben, migrieren (Schlüssel `hwz-todo`).
- `src/lib/storage.test.ts`: Tests für Speichern, Neuladen und kaputtes JSON.
- `src/features/tasks/useTasks.ts`: React-Hook, verbindet model.ts mit storage.ts.
- `src/features/tasks/useTasks.test.ts`: Tests für den Hook (Zustand bleibt nach Neuladen).
- `src/features/tasks/components/TaskInput.tsx`: Eingabe mit Plus-Knopf (DESIGN.md, Rezept 2).
- `src/features/tasks/components/TaskInput.test.tsx`: Tests fürs Hinzufügen, leere Eingabe, «N»-Hotkey.
- `src/features/tasks/components/TaskCard.tsx`: Eine Aufgabe mit Checkbox, Text, Löschen (Rezept 3).
- `src/features/tasks/components/TaskCard.test.tsx`: Tests für Abhaken, Konfetti, Löschen mit Rückgängig.
- `src/features/tasks/components/TaskList.tsx`: Liste mit Listen-Animationen (Rezept 4).
- `src/features/tasks/components/EmptyState.tsx`: Leerer Zustand mit Look-Illustration (Rezept 5).
- `src/components/ProgressRing.tsx`: Fortschrittsring für erledigt/gesamt (Rezept 1).
- `src/components/ProgressRing.test.tsx`: Tests für Ring und aria-label.
- `src/lib/useHotkey.ts`: Hook für «N» fokussiert die Eingabe (Rezept 9).
- `src/lib/celebrate.ts`: Konfetti auslösen, im Test ersetzbar (Rezept 3).
- `src/lib/theme.ts`: Konfettifarben aus CSS-Variablen lesen (DESIGN.md, Werte für JavaScript).
- `src/App.tsx`: App-Rahmen mit Hero, Datum, Fortschrittsring, MotionConfig, TooltipProvider, Toaster.

## Datenmodell

```ts
// localStorage "hwz-todo" = { version: 1, tasks: Task[] }
export type Task = {
  id: string // crypto.randomUUID()
  title: string // getrimmt, 1 bis 200 Zeichen
  done: boolean
  createdAt: number // Date.now()
}

export const CURRENT_VERSION = 1
export type State = { version: number; tasks: Task[] }
```

loadState gibt bei fehlendem oder kaputtem Inhalt `{ version: CURRENT_VERSION, tasks: [] }` zurück und wirft keinen Fehler. saveState speichert nach jeder Änderung den ganzen Zustand.

## Komponenten

- ProgressRing: SVG-Ring, zeigt erledigt/gesamt, federt bei Änderung (DESIGN.md, Rezept 1).
- TaskInput: Glas-Eingabe mit Plus-Knopf, Enter fügt hinzu, leere Eingabe schüttelt (Rezept 2).
- TaskCard: motion.li mit Checkbox, durchgestrichenem Text, Konfetti und Löschknopf mit Rückgängig (Rezept 3).
- TaskList: AnimatePresence-Liste, neue oben, gleitend rein und raus (Rezepte 3 und 4).
- EmptyState: Look-Illustration (Candy: lächelnde Wolke) und freundlicher Satz (Rezept 5).
- App.tsx: Kopf mit Datum, Hero, Ring; umschliesst alles mit MotionConfig, TooltipProvider, Toaster (Rezept 1).

## Risiken

- Konfetti im Test: canvas-confetti nutzt jsdom-untaugliche APIs – Aufruf in `celebrate.ts` kapseln und im Test mocken.
- Lokale Zeit des Datums: `Intl.DateTimeFormat('de-CH')` je nach Test-Umgebung – Datum nicht in Tests prüfen.
- «N»-Hotkey trifft trotz Eingabefeld: Hook prüft event.target auf input/textarea/contenteditable (Rezept 9).
