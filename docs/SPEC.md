# SPEC: Was die App können muss

Diese Datei füllt /spec. Ein ausgefülltes Beispiel steht in docs/PROMPTS.md unter «Beispiel einer SPEC».

## Ziel

Eine ToDo-App für mich, die grossartig aussieht, Freude macht und im Handumdrehen meine Aufgaben in den Griff bekommt – mit viel Farbe, Bewegung und hochwertigen Flächen.

## Muss

- Aufgabe mit Titel anlegen: per Enter oder Plus-Knopf, leere Eingabe schüttelt das Feld.
- Aufgabe abhaken und wieder öffnen: Text wird animiert durchgestrichen, Konfetti in Look-Farben, Zähler steigt.
- Aufgabe löschen, mit «Rückgängig»-Toast, der die Aufgabe an der alten Stelle wieder herstellt.
- Fortschrittsring zeigt «erledigt/gesamt» und federt bei jeder Änderung.
- Leerer Zustand zeigt die Illustration des Looks und einen freundlichen Satz.
- Datum oben am Kopf, im Format «Dienstag, 10. November».
- Tastatur: «N» fokussiert die Eingabe, Tab-Reihenfolge ist sinnvoll, Fokus ist überall sichtbar.
- Animierter Hintergrund-Verlauf, der bei «Bewegung reduzieren» stillsteht.

## Look

Candy

## Nicht

- Kein Login, kein Server. Die Daten bleiben im Browser.
- Kein Board mit Spalten – in Bau 1 nur die Liste.
- Keine Vorgaben für Daten importieren/exportieren.

## Fertig, wenn

1. Leere Eingabe
   - Gegeben: Das Eingabefeld ist leer oder enthält nur Leerzeichen.
   - Wenn: Ich Enter drücke.
   - Dann: Es kommt keine Aufgabe dazu und das Feld schüttelt sich kurz; der Fokus bleibt im Feld.
2. 200 Zeichen
   - Gegeben: Ich tippe einen Titel mit mehr als 200 Zeichen ohne Leerzeichen.
   - Wenn: Ich Enter drücke.
   - Dann: Die Aufgabe hat höchstens 200 Zeichen und der Text bricht in der Karte um, ohne dass etwas hinausläuft.
3. Neu laden
   - Gegeben: Ich habe Aufgaben angelegt, einige abgehakt.
   - Wenn: Ich die Seite neu lade.
   - Dann: Alle Aufgaben und ihr Zustand sind noch da.
4. Abhaken
   - Gegeben: Eine Aufgabe ist offen.
   - Wenn: Ich die Checkbox anklicke.
   - Dann: Der Text wird animiert durchgestrichen, es gibt Konfetti in Look-Farben, der Fortschrittsring zählt hoch; nochmal klicken macht es rückgängig.
5. Schmales Fenster
   - Gegeben: Das Fenster ist 360 px breit.
   - Wenn: Ich die App bediene und einen Titel mit 200 Zeichen ansehe.
   - Dann: Alles ist lesbar und bedienbar, ohne seitliches Scrollen, nichts läuft aus dem Bild.
6. Löschen mit Rückgängig
   - Gegeben: Eine Aufgabe existiert.
   - Wenn: Ich sie lösche.
   - Dann: Sie gleitet hinaus und ein Toast «Aufgabe gelöscht» mit «Rückgängig» erscheint; «Rückgängig» stellt sie an der alten Stelle wieder her.
7. Leerer Zustand
   - Gegeben: Es gibt keine Aufgaben.
   - Wenn: Ich die App öffne.
   - Dann: Sehe ich die Illustration des Looks (Candy: lächelnde Wolke) und den Satz «Alles erledigt. Zeit für Kaffee.»
8. Fortschrittsring
   - Gegeben: Es gibt 5 Aufgaben, 3 sind erledigt.
   - Wenn: Ich den Kopf ansehe.
   - Dann: Der Ring zeigt «3/5» und einen gefüllten Bogen; bei jeder Änderung federt er.
9. Tastatur und Fokus
   - Gegeben: Ich nutze nur die Tastatur.
   - Wenn: Ich «N» drücke, Tab drücke und eine Checkbox bediene.
   - Dann: «N» fokussiert die Eingabe (ausser der Fokus ist schon in einem Feld), der Fokus ist überall sichtbar im Look und alles ist erreichbar.
10. Hintergrund bewegt sich
    - Gegeben: Die App ist geöffnet.
    - Wenn: Ich sie ansehe.
    - Dann: Der pastellfarbene Hintergrund-Verlauf bewegt sich langsam; bei «Bewegung reduzieren» steht er still.

## Features

(leer)
