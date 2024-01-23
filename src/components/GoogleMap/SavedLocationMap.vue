<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import { onMounted, ref } from 'vue'
import { type Location } from '../../types/global-types'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID as string
const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY })
let map: google.maps.Map
let pollenHeatmapTileURL: string
let airHeatmapTileUrl: string
let pollenHeatmapLayer: google.maps.ImageMapType
let airHeatmapLayer: google.maps.ImageMapType
let pollenLayerOn = ref(true)
let airLayerOn = ref(false)

const props = defineProps<{
  location: Location
}>()

onMounted(async () => {
  if (props.location) {
    const { Map } = await loader.importLibrary('maps')
    map = new Map(document.getElementById('map') as HTMLElement, {
      zoom: props.location.zoom,
      center: { lat: props.location.lat, lng: props.location.lng },
      mapId: GOOGLE_MAP_ID,
      minZoom: 3,
      maxZoom: 16,
      restriction: {
        latLngBounds: {
          north: props.location.boundNorth,
          south: props.location.boundSouth,
          east: props.location.boundEast,
          west: props.location.boundWest
        },
        strictBounds: true
      },
      fullscreenControl: false,
      streetViewControl: false,
      scaleControl: false,
      rotateControl: false,
      zoomControl: false,
      mapTypeControl: false,
      clickableIcons: false,
      disableDefaultUI: true,
      scrollwheel: false,
      draggable: false,
      keyboardShortcuts: false,
      disableDoubleClickZoom: true,
      gestureHandling: 'none'
    })

    /* HEATMAP */
    const pollenType = 'TREE_UPI'
    const airQualityType = 'UAQI_RED_GREEN'
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
        // @ts-ignore
        return pollenHeatmapTileURL
          .replace('{z}', zoom.toString())
          .replace('{x}', coord.x.toString())
          .replace('{y}', coord.y.toString())
      },
      tileSize: new google.maps.Size(256, 256)
    })
    pollenHeatmapLayer.setOpacity(0.5)
    map.overlayMapTypes.insertAt(1, pollenHeatmapLayer)

    airHeatmapLayer = new google.maps.ImageMapType({
      getTileUrl: function (coord, zoom) {
        let north = map.getBounds()?.getNorthEast().lat() as number
        let south = map.getBounds()?.getSouthWest().lat() as number
        if (north > 80 || south < -80) {
          return ''
        }
        // @ts-ignore
        return airHeatmapTileUrl
          .replace('{z}', zoom.toString())
          .replace('{x}', coord.x.toString())
          .replace('{y}', coord.y.toString())
      },
      tileSize: new google.maps.Size(256, 256)
    })
    airHeatmapLayer.setOpacity(0)
    map.overlayMapTypes.insertAt(0, airHeatmapLayer)
  }
})
function togglePollenHeatmapOpacity(): void {
  if (pollenLayerOn.value) {
    pollenLayerOn.value = false
    pollenHeatmapLayer.setOpacity(0)
  } else {
    if (airLayerOn.value) {
      airLayerOn.value = false
      airHeatmapLayer.setOpacity(0)
    }
    pollenLayerOn.value = true
    pollenHeatmapLayer.setOpacity(0.5)
  }
}

function toggleAirHeatmapOpacity(): void {
  if (airLayerOn.value) {
    airLayerOn.value = false
    airHeatmapLayer.setOpacity(0)
  } else {
    if (pollenLayerOn.value) {
      pollenLayerOn.value = false
      pollenHeatmapLayer.setOpacity(0)
    }
    airLayerOn.value = true
    airHeatmapLayer.setOpacity(0.5)
  }
}
</script>

<template>
  <v-container class="tw-rounded-lg">
    <v-row justify="center" class="my-4">
      <v-btn color="light-blue lighten-3" class="tw-mr-2" @click="togglePollenHeatmapOpacity"
        >Toggle Pollen Layer</v-btn
      >
      <v-btn color="light-blue lighten-3" class="tw-mr-2" @click="toggleAirHeatmapOpacity"
        >Toggle Air Quality Layer</v-btn
      >
    </v-row>
    <div>
      <div class="google-map" id="map"></div>
    </div>
  </v-container>
</template>

<style scoped>
.google-map {
  width: 100%;
  height: 80vh;
}
</style>
