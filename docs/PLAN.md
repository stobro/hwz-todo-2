# PLAN: Wie die App gebaut wird

Diese Datei füllt /plan aus docs/SPEC.md.

## Stack

Siehe docs/STACK.md. Keine Abweichungen. Einzige Ergänzung in Bau 2: `maplibre-gl` (App, Karte), freigegeben in docs/SPEC.md unter F1. Vor Task 9 wird es mit ausdrücklichem Auftrag in docs/STACK.md und `scripts/setup.mjs` auf die Erlaubt-Liste gesetzt. Kartenstil: OpenFreeMap «positron» (`https://tiles.openfreemap.org/styles/positron`), hell und ohne API-Schlüssel.

## Ordner und Dateien

Bau 1 (fertig):

- `src/features/tasks/model.ts`, `model.test.ts`: Typ Task und reine Funktionen addTask, toggleTask, removeTask, restoreTask.
- `src/lib/storage.ts`, `storage.test.ts`: localStorage lesen, schreiben, migrieren (Schlüssel `hwz-todo`).
- `src/features/tasks/useTasks.ts`, `useTasks.test.ts`: React-Hook, verbindet model.ts mit storage.ts.
- `src/features/tasks/components/TaskInput.tsx`, `TaskCard.tsx`, `TaskList.tsx`, `EmptyState.tsx` mit Tests: Eingabe, Karte, Liste, leerer Zustand.
- `src/components/ProgressRing.tsx`, `src/lib/useHotkey.ts`, `src/lib/celebrate.ts`, `src/lib/theme.ts`, `src/App.tsx`: Rahmen und Hilfen.

Bau 2 (Terra), neu oder geändert:

- `src/lib/storage.ts`, `storage.test.ts`: Version 2, Migration `migrateV1toV2` mit Test aus echten V1-Daten.
- `src/features/tasks/model.ts`, `model.test.ts`: `status` statt `done`, dazu `moveTask`, `setLocation`, `clearLocation`, `countWithLocation`.
- `src/features/tasks/useTasks.ts`, `useTasks.test.ts`: neue Aktionen move, setLocation, clearLocation.
- `src/features/tasks/components/Board.tsx`, `Board.test.tsx`: drei Spalten mit Drag and Drop (Rezept 6).
- `src/features/tasks/components/TaskCard.tsx`, `TaskCard.test.tsx`: Status statt done, Ort-Symbol mit «Ort setzen» und «Ort entfernen», Hervorhebung.
- `src/features/map/model.ts`, `model.test.ts`: reine Funktionen für Pins (Status → Pin-Klasse, Ausschnitt über alle Pins, Text «3 von 5 mit Ort»).
- `src/features/map/components/TaskMap.tsx`, `TaskMap.test.tsx`: Kartenfläche mit Pins, Setz-Modus, Popup, Offline-Hinweis.
- `src/features/map/components/MapPin.tsx`: ein Pin als HTML-Marker mit motion (Federn, Hervorheben).
- `src/lib/map.ts`: dünne Hülle um maplibre-gl (Karte erzeugen, Marker, Klick, Ausschnitt), im Test ersetzbar wie `celebrate.ts`.
- `src/components/ViewSwitch.tsx`, `ViewSwitch.test.tsx`: Umschalter «Board | Karte» unter 1024 px.
- `src/App.tsx`, `src/App.test.tsx`: Kopf «Terra», Layout Board und Karte nebeneinander ab `lg`, gemeinsamer Zustand für Auswahl und Hover.
- `index.html`: Titel «Terra».

## Datenmodell

```ts
// localStorage "hwz-todo" = { version: 2, tasks: Task[] }
export type TaskStatus = 'todo' | 'doing' | 'done'

export type Location = {
  lat: number // −90 bis 90
  lng: number // −180 bis 180
}

export type Task = {
  id: string // crypto.randomUUID()
  title: string // getrimmt, 1 bis 200 Zeichen
  status: TaskStatus // ersetzt done
  createdAt: number // Date.now()
  location?: Location // optional, fehlt = kein Ort
}

export const CURRENT_VERSION = 2
export type State = { version: number; tasks: Task[] }
```

Migration nach docs/STACK.md, «Datenhaltung»: `migrateV1toV2` macht aus `done: true` → `status: 'done'`, aus `done: false` → `status: 'todo'`, kein `location`. loadState erkennt Version 1 und migriert, speichert danach als Version 2. Bei fehlendem oder kaputtem Inhalt gibt loadState `{ version: CURRENT_VERSION, tasks: [] }` zurück und wirft keinen Fehler. Ein ungültiger `location`-Wert wird verworfen, die Aufgabe bleibt erhalten.

Nicht gespeichert (nur im Speicher der App): ausgewählte Aufgabe, Aufgabe unter der Maus, Setz-Modus, aktive Ansicht des Umschalters.

## Komponenten

- App.tsx: Kopf mit «Terra» als Verlaufstext, Datum, Fortschrittsring, darunter Eingabe; ab `lg` Board und Karte nebeneinander in `max-w-6xl`, darunter ViewSwitch (Rezepte 1, 8).
- Board: Raster mit «Offen», «In Arbeit», «Erledigt», Zähler-Badge, DndContext mit Maus und Tastatur, Spalte leuchtet bei `isOver`, DragOverlay, Konfetti bei «Erledigt», deutsche Ansagen (Rezept 6, mobil Rezept 8).
- TaskCard: wie Bau 1, aber Checkbox setzt `done` bzw. `todo`; neuer Knopf mit `MapPin` (size-11) für «Ort setzen» oder Menü «Ort entfernen» (shadcn dropdown-menu); `glow`, wenn auf der Karte ausgewählt; meldet Hover und Fokus nach oben (Rezepte 3, 7).
- TaskMap: Fläche `glass rounded-2xl border` mit `bg-muted` als sofortiger Hintergrund, Karte blendet per motion ein, kein Spinner; Zeile «3 von 5 mit Ort»; Setz-Modus mit Hinweis und Esc; Offline-Hinweis «Karte gerade nicht erreichbar» (Rezept 4 für Ein- und Ausblenden).
- MapPin: runder Pin mit Status-Klasse (`bg-primary` Offen, `bg-secondary` In Arbeit, `bg-accent` Erledigt, je mit passendem `text-*-foreground`), federt beim Erscheinen, wird bei Hover grösser, ist ein Knopf mit `aria-label` «Ort von «Titel»».
- ViewSwitch: zwei shadcn-Buttons «Board» und «Karte» mit `aria-pressed`, nur unter `lg` sichtbar (Rezept 8).

## Risiken

- maplibre-gl braucht WebGL, das jsdom nicht kennt: Alles hinter `src/lib/map.ts` kapseln und im Test ersetzen; Logik der Pins liegt testbar in `src/features/map/model.ts`.
- Farben für Pins und Kartenstil ohne Hex-Werte: Pins sind HTML-Marker mit Token-Klassen, nicht Kartenschichten; der Kartenstil kommt fertig von OpenFreeMap.
- Neues Paket und geschützte Dateien: Task 9 startet erst nach ausdrücklichem Auftrag, `maplibre-gl` in docs/STACK.md und `scripts/setup.mjs` einzutragen. Ohne Netz zeigt die Karte den Offline-Hinweis, das Board läuft weiter.
