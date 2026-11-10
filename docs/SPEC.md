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

Bau 2 macht aus der Liste «Terra»: Jede Aufgabe kann einen Ort haben, und das Board und die Karte zeigen dieselben Daten in zwei synchronisierten Ansichten.

### F1: Terra – Board und Karte

Ich sehe meine Aufgaben als Scrum-Board und gleichzeitig als Pins auf einer hellen Karte. Was ich in der einen Ansicht ändere, sehe ich sofort in der anderen.

Rahmen:

- Karte mit MapLibre GL und einem hellen, freien Vektorstil ohne API-Schlüssel. Das Paket `maplibre-gl` kommt neu auf die Erlaubt-Liste.
- Look bleibt Candy, die Karte ist hell.
- Einen Ort setzt man per Klick auf die Karte. Keine Adresssuche, kein Routing, keine eigene Standortabfrage.
- Ab 1024 px Breite stehen Board und Karte nebeneinander. Darunter wechselt ein Umschalter «Board | Karte» die Ansicht.

1. Name im Kopf
   - Gegeben: Die App ist geöffnet.
   - Wenn: Ich den Kopf ansehe.
   - Dann: Die Überschrift heisst «Terra», mit Verlaufstext in der Schrift des Looks.
2. Board mit drei Spalten
   - Gegeben: Es gibt Aufgaben.
   - Wenn: Ich das Board ansehe.
   - Dann: Ich sehe die Spalten «Offen», «In Arbeit» und «Erledigt», jede mit der Anzahl ihrer Karten im Kopf.
3. Karte verschieben
   - Gegeben: Eine Karte liegt in «Offen».
   - Wenn: Ich sie per Maus oder per Tastatur (Leertaste, Pfeiltasten, Leertaste) nach «In Arbeit» ziehe.
   - Dann: Sie liegt in «In Arbeit», die Zielspalte hat beim Darüberziehen geleuchtet, und nach dem Neuladen ist sie immer noch dort. Landet sie in «Erledigt», gibt es Konfetti.
4. Ort setzen
   - Gegeben: Eine Aufgabe hat noch keinen Ort.
   - Wenn: Ich auf der Karte den Knopf «Ort setzen» drücke und dann auf die Karte klicke.
   - Dann: An dieser Stelle erscheint mit einer Federbewegung ein Pin, und die Karte im Board zeigt ein Ort-Symbol. Esc bricht das Setzen ab.
5. Board → Karte synchron
   - Gegeben: Eine Aufgabe mit Ort liegt in «Offen».
   - Wenn: Ich sie nach «Erledigt» verschiebe.
   - Dann: Ohne Neuladen bekommt ihr Pin sofort die Farbe für «Erledigt». Jeder Status hat eine eigene Pin-Farbe aus dem Look.
6. Karte → Board synchron
   - Gegeben: Mehrere Aufgaben haben einen Ort.
   - Wenn: Ich auf einen Pin klicke.
   - Dann: Ein Popup zeigt den Titel, und die passende Karte im Board leuchtet auf (glow) und wird in den sichtbaren Bereich gescrollt.
7. Hover verbindet
   - Gegeben: Eine Aufgabe mit Ort ist im Board und auf der Karte sichtbar.
   - Wenn: Ich mit der Maus über ihre Karte im Board fahre oder sie per Tab fokussiere.
   - Dann: Ihr Pin auf der Karte wird grösser und hebt sich hervor. Verlasse ich die Karte, wird er wieder normal.
8. Ort entfernen
   - Gegeben: Eine Aufgabe hat einen Ort.
   - Wenn: Ich im Board auf ihr Ort-Symbol und dann auf «Ort entfernen» klicke.
   - Dann: Der Pin verschwindet animiert von der Karte, die Aufgabe bleibt im Board.
9. Aufgaben ohne Ort
   - Gegeben: Von 5 Aufgaben haben 3 einen Ort.
   - Wenn: Ich die Karte ansehe.
   - Dann: Ich sehe genau 3 Pins, und über der Karte steht «3 von 5 mit Ort».
10. Start ohne Ladegefühl
    - Gegeben: Ich öffne die App.
    - Wenn: Die Karte lädt.
    - Dann: Board und Kopf sind sofort bedienbar, es gibt keinen Ladebalken und keinen Spinner. Die Kartenfläche zeigt sofort die Hintergrundfarbe des Looks, die Karte blendet ein, und der Ausschnitt zeigt alle Pins.
11. Karte offline
    - Gegeben: Es gibt keine Internetverbindung.
    - Wenn: Ich die App öffne.
    - Dann: Das Board funktioniert vollständig, und die Kartenfläche zeigt den Hinweis «Karte gerade nicht erreichbar».
12. Schmales Fenster mit Umschalter
    - Gegeben: Das Fenster ist 360 px breit.
    - Wenn: Ich mit «Board | Karte» umschalte.
    - Dann: Ich sehe jeweils eine Ansicht in voller Breite, ohne seitliches Scrollen der Seite, und die Spalten des Boards lassen sich wischen.
13. Alte Daten bleiben
    - Gegeben: Aufgaben aus der alten Version sind gespeichert.
    - Wenn: Ich die neue Version öffne.
    - Dann: Alle Aufgaben sind noch da, im richtigen Zustand: Erledigte liegen in «Erledigt», offene in «Offen», und alle sind ohne Ort.
