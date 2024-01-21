<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { type SelectionBoundary } from '../../types/global-types'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID as string
const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY })
let map: google.maps.Map
let locationSelector: google.maps.Rectangle

/* Map Default Position */
const lat = 41.85
const lng = -87.65
const position = { lat: lat, lng: lng }
/* Map Selection  */
/* North east -> top right point = 41.85, -87.65 */
let selectBounds: SelectionBoundary
let bounds = [
  { lat: lat, lng: lng },
  { lat: lat, lng: lng },
  { lat: lat, lng: lng },
  { lat: lat, lng: lng }
]
const isSelecting = ref(false)

onMounted(async () => {
  const { Map } = await loader.importLibrary('maps')
  map = new Map(document.getElementById('map') as HTMLElement, {
    zoom: 3,
    center: position,
    mapId: GOOGLE_MAP_ID,
    minZoom: 3,
    maxZoom: 16,
    // restriction: {
    // latLngBounds: bounds,
    // strictBounds: false,
    // }
    fullscreenControl: false,
    streetViewControl: false,
    scaleControl: false
  })

  /* HEATMAP */

  /*
  TREE_UPI
  GRASS_UPI
  WEED_UPI
  */
  // Define the heatmap tile URL pattern
  const pollenType = 'TREE_UPI'
  /* 
  y-axis goes down as y value increases (top to bottom) 
  x-axis goes left to right
  */
  let heatmapTileURL = `https://pollen.googleapis.com/v1/mapTypes/${pollenType}/heatmapTiles/{z}/{x}/{y}?key=${GOOGLE_MAPS_API_KEY}`

  // Create a new ImageMapType with the heatmap tile URL
  let pollenHeatmapLayer = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
      // @ts-ignore
      return heatmapTileURL.replace('{z}', zoom).replace('{x}', coord.x).replace('{y}', coord.y)
    },
    tileSize: new google.maps.Size(256, 256)
  })
  pollenHeatmapLayer.setOpacity(0.5)

  // Overlay the heatmap tiles on the map
  map.overlayMapTypes.insertAt(0, pollenHeatmapLayer)

  function togglePollenHeatmap(): void {
    if (map.overlayMapTypes.getLength() > 0) {
      map.overlayMapTypes.removeAt(0)
    } else {
      map.overlayMapTypes.insertAt(0, pollenHeatmapLayer)
    }
  }

  function toggleOpacity(): void {
    const opacity = pollenHeatmapLayer.getOpacity()
    switch (opacity) {
      case 0:
        pollenHeatmapLayer.setOpacity(0.2)
        break
      case 0.2:
        pollenHeatmapLayer.setOpacity(0.35)
        break
      case 0.35:
        pollenHeatmapLayer.setOpacity(0.5)
        break
      case 0.5:
        pollenHeatmapLayer.setOpacity(0.7)
        break
      case 0.7:
        pollenHeatmapLayer.setOpacity(0)
        break
      default:
        pollenHeatmapLayer.setOpacity(0.2)
        break
    }
  }
  document.getElementById('toggle-pollen-heatmap')!.addEventListener('click', togglePollenHeatmap)
  document.getElementById('toggle-opacity')!.addEventListener('click', toggleOpacity)

  /* Location Saving */

  locationSelector = new google.maps.Rectangle({
    map: map,
    bounds: selectBounds,
    editable: true,
    draggable: true,
    visible: false
  })

  /* User Position Focus */
  const errorWindow = new google.maps.InfoWindow()
  const locationButton = document.createElement('button')

  locationButton.textContent = 'View Current Location'
  locationButton.classList.add('custom-map-control-button')

  map.controls[google.maps.ControlPosition.BLOCK_START_INLINE_START].push(locationButton)

  locationButton.addEventListener('click', () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }

          map.setCenter(pos)
        },
        () => {
          handleLocationError(true, errorWindow, map.getCenter()!)
        }
      )
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, errorWindow, map.getCenter()!)
    }
  })
  function handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: google.maps.InfoWindow,
    pos: google.maps.LatLng
  ) {
    infoWindow.setPosition(pos)
    infoWindow.setContent(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation."
    )
    infoWindow.open(map)
  }
})


</script>

<template>
  <div id="floating-panel">
    <button id="toggle-pollen-heatmap">Toggle Heatmap</button>
    <button id="toggle-opacity">Toggle opacity</button>
    <button v-if="!isSelecting" id="select-location" @click="handleSelecting">
      Select Location
    </button>
    <button v-if="isSelecting" id="cancel-select-location" @click="handleCancelSelection">
      Cancel
    </button>
    <button v-if="isSelecting" id="save-location">Save Location</button>
  </div>
  <div>
    <div class="google-map" id="map"></div>
  </div>
</template>

<style scoped>
.google-map {
  width: 100%;
  height: 80vh;
}
</style>
