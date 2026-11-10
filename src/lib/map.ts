import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import type { Location } from '@/lib/storage'

// Dünne Hülle um maplibre-gl, damit Komponenten ohne WebGL testbar bleiben (vi.mock).
// Heller, freier Vektorstil ohne API-Schlüssel (docs/PLAN.md).
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'

// Startausschnitt ohne Pins: die Schweiz.
const DEFAULT_CENTER: [number, number] = [8.23, 46.8]
const DEFAULT_ZOOM = 6.5

// Vite bündelt den Worker selbst; ohne diese Zeile findet maplibre ihn nach dem Vorbündeln nicht.
maplibregl.setWorkerUrl(workerUrl)

export type MapOptions = {
  onLoad: () => void
  onError: () => void
  onClick: (location: Location) => void
}

export type MarkerHandle = {
  setLocation: (location: Location) => void
  remove: () => void
}

export type MapHandle = {
  addMarker: (element: HTMLElement, location: Location) => MarkerHandle
  fitTo: (bounds: [number, number, number, number] | null) => void
  setPlacing: (placing: boolean) => void
  remove: () => void
}

export function createMap(container: HTMLElement, options: MapOptions): MapHandle {
  const map = new maplibregl.Map({
    container,
    style: MAP_STYLE_URL,
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    attributionControl: { compact: true },
    fadeDuration: 300,
    locale: {
      'NavigationControl.ZoomIn': 'Hineinzoomen',
      'NavigationControl.ZoomOut': 'Herauszoomen',
      'AttributionControl.ToggleAttribution': 'Quellen anzeigen',
    },
  })
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

  let loaded = false
  map.on('load', () => {
    loaded = true
    options.onLoad()
  })
  // Fehler beim Laden von Stil oder Kacheln (z. B. offline) melden.
  map.on('error', () => {
    if (!loaded || !navigator.onLine) options.onError()
  })
  map.on('click', (event) => options.onClick({ lat: event.lngLat.lat, lng: event.lngLat.lng }))

  return {
    addMarker(element, location) {
      const marker = new maplibregl.Marker({ element, anchor: 'center' })
        .setLngLat([location.lng, location.lat])
        .addTo(map)
      return {
        setLocation: (next) => marker.setLngLat([next.lng, next.lat]),
        remove: () => marker.remove(),
      }
    },
    fitTo(bounds) {
      if (!bounds) return
      const [west, south, east, north] = bounds
      map.fitBounds(
        [
          [west, south],
          [east, north],
        ],
        { padding: 64, maxZoom: 14, duration: 0 },
      )
    },
    setPlacing(placing) {
      map.getCanvas().style.cursor = placing ? 'crosshair' : ''
    },
    remove: () => map.remove(),
  }
}
