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
