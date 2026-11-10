# TASKS: Bauschritte

Diese Datei füllt /plan. /task arbeitet sie von oben nach unten ab und hakt jeden Task ab.
Ein Beispiel mit allen 6 Tasks von Bau 1 steht in docs/PROMPTS.md unter «Beispiel: die 6 Tasks von Bau 1».

Format je Task:

```text
[ ] N  Titel
- Ziel: Ein Satz, was danach sichtbar oder möglich ist.
- Dateien: Genau die Dateien, die geändert werden dürfen.
- Test zuerst: Welcher Test zuerst rot sein muss.
- Fertig wenn: Prüfbares Ergebnis plus «npm run check grün».
```

## Tasks

[x] 1  Projekt einrichten
- Ziel: Leerer App-Rahmen im Look Candy läuft unter http://localhost:5173/hwz-todo/.
- Dateien: alle aus docs/STACK.md, Abschnitt «Dateien für Task 1», plus src/components/ui/*.
- Test zuerst: src/App.test.tsx (kommt mit Task 1, siehe STACK.md).
- Fertig wenn: npm run check grün, Hero-Überschrift sichtbar.

[x] 2  Datenmodell und Store mit Tests
- Ziel: Aufgaben lassen sich anlegen, abhaken, löschen und im localStorage speichern, noch ohne Oberfläche.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/lib/storage.ts, src/lib/storage.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts.
- Test zuerst: addTask ignoriert leeren Titel und kürzt auf 200 Zeichen; loadState gibt bei kaputtem JSON eine leere Liste zurück.
- Fertig wenn: alle Model- und Storage-Tests grün, Zustand bleibt nach Neuladen erhalten (SPEC «Neu laden»), npm run check grün.

[x] 3  Liste anzeigen
- Ziel: Gespeicherte Aufgaben erscheinen als TaskCards mit Listen-Animation.
- Dateien: src/features/tasks/components/TaskList.tsx, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/App.tsx.
- Test zuerst: TaskList zeigt zwei Aufgaben aus dem localStorage nach dem Rendern an.
- Fertig wenn: Aufgaben sichtbar (SPEC «Schmales Fenster», «200 Zeichen»), DESIGN.md Rezepte 3, 4, 7 erfüllt, npm run check grün.

[x] 4  Aufgabe hinzufügen
- Ziel: Neue Aufgabe per Enter oder Plus-Knopf, leere Eingabe schüttelt.
- Dateien: src/features/tasks/components/TaskInput.tsx, src/features/tasks/components/TaskInput.test.tsx, src/lib/useHotkey.ts, src/App.tsx.
- Test zuerst: Tippen + Enter zeigt die Aufgabe; Enter bei leerem Feld fügt nichts hinzu; «N» fokussiert das Feld.
- Fertig wenn: DESIGN.md Rezepte 2 und 9 erfüllt (SPEC «Leere Eingabe», «Tastatur und Fokus»), npm run check grün.

[x] 5  Abhaken und löschen
- Ziel: Abhaken mit Federn, Durchstreichen und Konfetti; Löschen mit Toast «Rückgängig».
- Dateien: src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/lib/celebrate.ts, src/lib/theme.ts.
- Test zuerst: Klick auf Checkbox setzt done und ruft celebrate auf; Löschen und «Rückgängig» stellt die Aufgabe wieder her.
- Fertig wenn: DESIGN.md Rezept 3 erfüllt (SPEC «Abhaken», «Löschen mit Rückgängig»), Zustand bleibt nach Neuladen, npm run check grün.

[x] 6  Zähler und leerer Zustand
- Ziel: Fortschrittsring zeigt erledigt/gesamt; ohne Aufgaben erscheint die Illustration des Looks.
- Dateien: src/components/ProgressRing.tsx, src/components/ProgressRing.test.tsx, src/features/tasks/components/EmptyState.tsx, src/App.tsx.
- Test zuerst: Ring hat aria-label «1 von 2 erledigt»; leere Liste zeigt «Alles erledigt. Zeit für Kaffee.».
- Fertig wenn: DESIGN.md Rezepte 1 und 5 erfüllt (SPEC «Fortschrittsring», «Leerer Zustand», «Hintergrund bewegt sich»), npm run check grün.

[x] 7  Migration mit Test
- Ziel: Aufgaben haben `status` statt `done` und optional `location`, alte Daten aus Version 1 werden ohne Verlust übernommen.
- Dateien: src/lib/storage.ts, src/lib/storage.test.ts, src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/App.tsx.
- Test zuerst: loadState mit echten V1-Daten (`done: true` und `done: false`) liefert Version 2 mit `status: 'done'` und `status: 'todo'`, ohne `location`.
- Fertig wenn: Abhaken setzt `done` bzw. `todo`, der Ring zählt weiter richtig (SPEC «Alte Daten bleiben», «Neu laden»), npm run check grün.

[x] 8  Board mit drei Spalten und Drag and Drop
- Ziel: Aufgaben erscheinen in «Offen», «In Arbeit», «Erledigt» und lassen sich per Maus und Tastatur verschieben; der Kopf heisst «Terra».
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/components/Board.tsx, src/features/tasks/components/Board.test.tsx, src/features/tasks/components/TaskCard.tsx, src/App.tsx, src/App.test.tsx, index.html.
- Test zuerst: `moveTask(tasks, id, 'doing', 0)` setzt Status und Reihenfolge; Board zeigt drei Spaltenüberschriften mit Zähler; h1 lautet «Terra».
- Fertig wenn: DESIGN.md Rezept 6 erfüllt, Verschieben bleibt nach Neuladen, Konfetti bei «Erledigt» (SPEC «Name im Kopf», «Board mit drei Spalten», «Karte verschieben»), npm run check grün.

[x] 9  Karte mit Pins
- Ziel: Neben dem Board steht eine helle Karte, die jede Aufgabe mit Ort als Pin in ihrer Status-Farbe zeigt, ohne Spinner und mit Offline-Hinweis.
- Dateien: docs/STACK.md, scripts/setup.mjs, package.json, package-lock.json, src/lib/map.ts, src/features/map/model.ts, src/features/map/model.test.ts, src/features/map/components/TaskMap.tsx, src/features/map/components/TaskMap.test.tsx, src/features/map/components/MapPin.tsx, src/App.tsx.
- Test zuerst: `pinClass('done')` liefert `bg-accent`; `locationSummary(tasks)` liefert «3 von 5 mit Ort»; TaskMap zeigt bei Kartenfehler «Karte gerade nicht erreichbar».
- Fertig wenn: Pins erscheinen, Pin-Farbe folgt dem Status ohne Neuladen, Ausschnitt zeigt alle Pins (SPEC «Board → Karte synchron», «Aufgaben ohne Ort», «Start ohne Ladegefühl», «Karte offline»), npm run check grün. Start nur nach ausdrücklichem Auftrag für docs/STACK.md und scripts/setup.mjs.

[x] 10  Ort setzen und entfernen
- Ziel: Über das Ort-Symbol einer Karte setzt man per Klick auf die Karte einen Ort oder entfernt ihn wieder.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/features/map/components/TaskMap.tsx, src/features/map/components/TaskMap.test.tsx, src/features/map/components/MapPin.tsx, src/App.tsx.
- Test zuerst: `setLocation` und `clearLocation` ändern nur die eine Aufgabe; Klick auf «Ort setzen» zeigt den Hinweis zum Setzen, Esc beendet ihn.
- Fertig wenn: Pin federt herein und gleitet beim Entfernen hinaus, Ort bleibt nach Neuladen (SPEC «Ort setzen», «Ort entfernen»), npm run check grün.

[x] 11  Board und Karte verbinden
- Ziel: Ein Klick auf einen Pin hebt die Karte im Board hervor, und Hover oder Fokus auf einer Karte hebt ihren Pin hervor.
- Dateien: src/features/tasks/components/Board.tsx, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/features/map/components/TaskMap.tsx, src/features/map/components/TaskMap.test.tsx, src/features/map/components/MapPin.tsx, src/App.tsx.
- Test zuerst: Klick auf einen Pin gibt der passenden TaskCard die Klasse `glow` und ruft `scrollIntoView` auf; Fokus auf einer TaskCard markiert ihren Pin als hervorgehoben.
- Fertig wenn: Popup zeigt den Titel, Pin wird beim Hover grösser und wieder normal (SPEC «Karte → Board synchron», «Hover verbindet»), npm run check grün.

[x] 12  Umschalter und schmales Fenster
- Ziel: Ab 1024 px stehen Board und Karte nebeneinander, darunter wechselt «Board | Karte» die Ansicht in voller Breite.
- Dateien: src/components/ViewSwitch.tsx, src/components/ViewSwitch.test.tsx, src/features/tasks/components/Board.tsx, src/App.tsx, src/App.test.tsx.
- Test zuerst: Klick auf «Karte» setzt `aria-pressed` und zeigt die Kartenfläche statt des Boards.
- Fertig wenn: Bei 360 px kein seitliches Scrollen der Seite, Spalten wischbar, 200-Zeichen-Titel bricht um (SPEC «Schmales Fenster mit Umschalter», «Schmales Fenster», «200 Zeichen»), npm run check grün.
