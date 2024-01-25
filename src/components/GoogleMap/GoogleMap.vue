<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { type SelectionBoundary, type Location } from '../../types/global-types'
import { useAuthStore } from '@/stores/auth'
import { useLocationStore } from '@/stores/location'
import { useRouter } from 'vue-router'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID as string
const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY })
const authStore = useAuthStore()
const locationStore = useLocationStore()
const router = useRouter()
let map: google.maps.Map
let locationSelector: google.maps.Rectangle
let pollenHeatmapTileURL: string
let airHeatmapTileUrl: string
let pollenHeatmapLayer: google.maps.ImageMapType
let airHeatmapLayer: google.maps.ImageMapType
let heatmapXCord: number
let heatmapYCord: number
let pollenLayerOn = ref(false)
let airLayerOn = ref(false)
const showAlert = ref(false)

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
  const pollenType = 'TREE_UPI'
  const airQualityType = 'UAQI_RED_GREEN'
  /* 
  y-axis goes down as y value increases (top to bottom) 
  x-axis goes left to right
  */
  pollenHeatmapTileURL = `https://pollen.googleapis.com/v1/mapTypes/${pollenType}/heatmapTiles/{z}/{x}/{y}?key=${GOOGLE_MAPS_API_KEY}`
  airHeatmapTileUrl = `https://airquality.googleapis.com/v1/mapTypes/${airQualityType}/heatmapTiles/{z}/{x}/{y}?key=${GOOGLE_MAPS_API_KEY}`

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
      // @ts-ignore
      return pollenHeatmapTileURL
        .replace('{z}', zoom.toString())
        .replace('{x}', coord.x.toString())
        .replace('{y}', coord.y.toString())
    },
    tileSize: new google.maps.Size(256, 256)
  })
  pollenHeatmapLayer.setOpacity(0.5)

  airHeatmapLayer = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
      let north = map.getBounds()?.getNorthEast().lat() as number
      let south = map.getBounds()?.getSouthWest().lat() as number
      if (north > 80 || south < -80) {
        return ''
      }
      // @ts-ignore
      return airHeatmapTileUrl.replace('{z}', zoom).replace('{x}', coord.x).replace('{y}', coord.y)
    },
    tileSize: new google.maps.Size(256, 256)
  })
  airHeatmapLayer.setOpacity(0.5)

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
  locationButton.style.backgroundColor = '#fff'
  locationButton.style.border = '2px solid #fff'
  locationButton.style.borderRadius = '3px'
  locationButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)'
  locationButton.style.color = 'rgb(25,25,25)'
  locationButton.style.cursor = 'pointer'
  locationButton.style.fontFamily = 'Roboto,Arial,sans-serif'
  locationButton.style.fontSize = '16px'
  locationButton.style.lineHeight = '38px'
  locationButton.style.margin = '8px 0 22px'
  locationButton.style.padding = '0 5px'
  map.controls[google.maps.ControlPosition.BLOCK_START_INLINE_CENTER].push(locationButton)

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

function togglePollenHeatmap(): void {
  if (pollenLayerOn.value) {
    pollenLayerOn.value = false
    map.overlayMapTypes.removeAt(0)
  } else {
    if (airLayerOn.value) {
      airLayerOn.value = false
      map.overlayMapTypes.removeAt(0)
    }
    pollenLayerOn.value = true
    map.overlayMapTypes.insertAt(0, pollenHeatmapLayer)
  }
}

function toggleAirHeatmap(): void {
  if (airLayerOn.value) {
    airLayerOn.value = false
    map.overlayMapTypes.removeAt(0)
  } else {
    if (pollenLayerOn.value) {
      pollenLayerOn.value = false
      map.overlayMapTypes.removeAt(0)
    }
    airLayerOn.value = true
    map.overlayMapTypes.insertAt(0, airHeatmapLayer)
  }
}

function toggleOpacity(): void {
  const opacity = pollenHeatmapLayer.getOpacity()
  switch (opacity) {
    case 0:
      pollenHeatmapLayer.setOpacity(0.2)
      airHeatmapLayer.setOpacity(0.2)
      break
    case 0.2:
      pollenHeatmapLayer.setOpacity(0.35)
      airHeatmapLayer.setOpacity(0.35)
      break
    case 0.35:
      pollenHeatmapLayer.setOpacity(0.5)
      airHeatmapLayer.setOpacity(0.5)
      break
    case 0.5:
      pollenHeatmapLayer.setOpacity(0.7)
      airHeatmapLayer.setOpacity(0.7)
      break
    case 0.7:
      pollenHeatmapLayer.setOpacity(0)
      airHeatmapLayer.setOpacity(0)
      break
    default:
      pollenHeatmapLayer.setOpacity(0.2)
      airHeatmapLayer.setOpacity(0.2)
      break
  }
}

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
    return
  }
  if (!authStore.$state.session.user) {
    router.push({ path: '/signin' })
    return
  }
  const title = window.prompt('Enter the title:')
  if (title === null || title === '') {
    return
  }
  const currentBounds = locationSelector.getBounds()
  const north = currentBounds?.getNorthEast().lat() as number
  const east = currentBounds?.getNorthEast().lng() as number
  const south = currentBounds?.getSouthWest().lat() as number
  const west = currentBounds?.getSouthWest().lng() as number
  const center = currentBounds?.getCenter()
  const savedLocation = {
    lat: center?.lat(),
    lng: center?.lng(),
    zoom: map.getZoom(),
    boundNorth: north,
    boundSouth: south,
    boundEast: east,
    boundWest: west,
    heatmapGridSizeX: heatmapXCord,
    heatmapGridSizeY: heatmapYCord,
    title: title
  } as Location
  await locationStore.savedLocation(savedLocation)
  isSelecting.value = false
  locationSelector.setVisible(false)
  showAlert.value = true
}
</script>

<template>
  <v-container class="tw-rounded-lg">
    <v-alert
      v-model="showAlert"
      type="success"
      closable
      close-label="Close Alert"
      elevation="2"
      icon="mdi-check-circle-outline"
      @input="() => (showAlert = false)"
      @click:close="() => (showAlert = false)"
    >
      Saving successful!
    </v-alert>
    <div>
      <div class="google-map" id="map"></div>
    </div>
    <v-row justify="center" class="my-4">
      <v-btn color="light-blue lighten-3" class="tw-mr-2" @click="togglePollenHeatmap"
        >Toggle Pollen Layer</v-btn
      >
      <v-btn color="light-blue lighten-3" class="tw-mr-2" @click="toggleAirHeatmap"
        >Toggle Air Quality Layer</v-btn
      >
      <v-btn color="light-blue lighten-3" class="tw-mr-2" @click="toggleOpacity"
        >Toggle opacity</v-btn
      >
      <v-btn
        v-if="!isSelecting"
        color="light-blue lighten-3"
        class="tw-mr-2"
        @click="handleSelecting"
        >Select Location</v-btn
      >
      <v-btn
        v-if="isSelecting"
        color="light-blue lighten-3"
        class="tw-mr-2"
        @click="handleCancelSelection"
        >Cancel</v-btn
      >
      <v-btn
        v-if="isSelecting"
        color="light-blue lighten-3"
        class="tw-mr-2"
        @click="handleSaveLocation"
        >Save Location</v-btn
      >
    </v-row>
  </v-container>
</template>

<style scoped>
.google-map {
  width: 100%;
  height: 80vh;
}
</style>
