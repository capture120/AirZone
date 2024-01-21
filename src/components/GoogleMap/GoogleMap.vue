<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { type SelectionBoundary, type Location } from '../../types/global-types'
import { useAuthStore } from '@/stores/auth'
import { useLocationStore } from '@/stores/locations'
import { useRouter } from 'vue-router'


const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID as string
const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY });
const authStore = useAuthStore();
const locationStore = useLocationStore();
const router = useRouter()
let map: google.maps.Map
let locationSelector: google.maps.Rectangle
let heatmapTileURL: string
let pollenHeatmapLayer: google.maps.ImageMapType
let heatmapXCord: number
let heatmapYCord: number
let heatmapZoom: number

/* Map Default Position */
const lat = 41.85
const lng = -87.65
const position = { lat: lat, lng: lng }

/* Map Selection  */
let selectBounds: SelectionBoundary
let bounds = {
  north: 85.05,
  south: -83,
  east: 180,
  west: -180
}
const isSelecting = ref(false)

onMounted(async () => {
  const { Map } = await loader.importLibrary('maps')
  map = new Map(document.getElementById('map') as HTMLElement, {
    zoom: 3,
    center: position,
    mapId: GOOGLE_MAP_ID,
    minZoom: 3,
    maxZoom: 16,
    restriction: {
      latLngBounds: bounds,
      strictBounds: true
    },
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
  heatmapTileURL = `https://pollen.googleapis.com/v1/mapTypes/${pollenType}/heatmapTiles/{z}/{x}/{y}?key=${GOOGLE_MAPS_API_KEY}`

  // Create a new ImageMapType with the heatmap tile URL
  pollenHeatmapLayer = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
      let north = map.getBounds()?.getNorthEast().lat() as number
      let south = map.getBounds()?.getSouthWest().lat() as number
      if (north > 80 || south < -80) {
        return ''
      }
      heatmapXCord = coord.x
      heatmapYCord = coord.y
      heatmapZoom = zoom
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

          map.setZoom(11)
          map.setCenter(pos)
        },
        () => {}
      )
    }
  })
})

function handleSelecting() {
  isSelecting.value = true
  const currentBounds = map.getBounds()
  let north = currentBounds?.getCenter().lat() as number
  let east = currentBounds?.getCenter().lng() as number
  let south = currentBounds?.getCenter().lat() as number
  let west = currentBounds?.getCenter().lng() as number
  const currentZoom = map.getZoom() as number
  const scale = (1 / currentZoom ** 2) * (24 / currentZoom)

  /*
  north/south is different than x-y for google maps 
  since latitude and longitude is used
  */
  locationSelector.setBounds({
    north: north - scale, // decrease -> moves latitude down
    east: east + scale, // increase -> moves longitude right
    south: south + scale, // increase -> moves latitude up
    west: west - scale // decrease -> moves longitude left
  })
  locationSelector.setVisible(true)
}

function handleCancelSelection() {
  isSelecting.value = false
  locationSelector.setVisible(false)
}

async function handleSaveLocation() {
  if (!isSelecting.value) {
    return;
  }
  if (!authStore.$state.session.user){
    router.push({ path: '/signin' });
    return;
  } 
  const currentBounds = locationSelector.getBounds()
  const north = currentBounds?.getCenter().lat() as number
  const east = currentBounds?.getCenter().lng() as number
  const south = currentBounds?.getCenter().lat() as number
  const west = currentBounds?.getCenter().lng() as number
  const center = currentBounds?.getCenter()
  const savedLocation = {
    lat: center?.lat(),
    lng: center?.lng(),
    zoom: heatmapZoom,
    boundNorth: north,
    boundSouth: south,
    boundEast: east,
    boundWest: west,
    heatmapGridSizeX: heatmapXCord,
    heatmapGridSizeY: heatmapYCord,
    title: 'default'
  } as Location
  await locationStore.savedLocation(savedLocation)

  if (!location) {
    alert('Saving location failed.')
  } else {
    alert('Location saved.')
  }
  isSelecting.value=false
  locationSelector.setVisible(false);
  // console.log(`North ${north}\n`, `South ${south}\n`, `East ${east}\n`,`west ${west}`)
}
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
    <button v-if="isSelecting" id="save-location" @click="handleSaveLocation">Save Location</button>
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
