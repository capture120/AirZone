<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import { onMounted, ref } from 'vue'
import { type Location } from '../../types/global-types'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID as string
const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY })
const TILE_SIZE = 256

let map: google.maps.Map
let pollenHeatmapTileURL: string
let airHeatmapTileUrl: string
let pollenHeatmapLayer: google.maps.ImageMapType
let airHeatmapLayer: google.maps.ImageMapType
let pollenLayerOn = ref(true)
let airLayerOn = ref(false)
let mapElementWidth: number
const props = defineProps<{
  location: Location
}>()
const bounds = {
  north: props.location.boundNorth,
  east: props.location.boundEast,
  south: props.location.boundSouth,
  west: props.location.boundWest
}

onMounted(async () => {
  console.log(JSON.stringify(bounds))
  if (props.location) {
    const { Map } = await loader.importLibrary('maps')

    const mapElement = document.getElementById('map')
    if (!mapElement) {
      mapElementWidth = 0
    } else {
      mapElementWidth = mapElement.offsetWidth
    }
    console.log(mapElementWidth)
    const zoom = calculateApproximateZoomLevel(mapElementWidth)

    map = new Map(document.getElementById('map') as HTMLElement, {
      zoom: zoom,
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
        strictBounds: false
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

    // new AdvancedMarkerElement({
    //   map: map,
    //   position: { lat: props.location.lat, lng: props.location.lng },
    //   title: props.location.title
    // })

    // new google.maps.Rectangle({
    //   map: map,
    //   bounds: {
    //     north: props.location.boundNorth,
    //     south: props.location.boundSouth,
    //     east: props.location.boundEast,
    //     west: props.location.boundWest
    //   },
    //   editable: false,
    //   draggable: false,
    //   visible: false,
    // })

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

function calculateApproximateZoomLevel(mapElementWidth: number): number {
  const west = bounds.west
  const east = bounds.east
  let angle = east - west
  if (angle < 0) {
    angle += 360
  }
  const pixelWidth = (mapElementWidth * 360) / angle
  /*
   from  https://developers.google.com/maps/documentation/javascript/coordinates#tile-coordinates 
  We want the zoom level such that the boundary is in frame. It is not exact due to:
  - map dimensions being different than user's location selection dimension
  We know that:
    - pixelCoordinate = worldCoordinate * 2^(zoomLevel)
    - each zoom level doubles the scale of the map
    - the map is 360 degrees wide
    - we can determine the approximate scale by which the world has been altered by the zoom level, and reduce zoom to its 
      scaled form used by Google

  */
  const zoom = Math.round(Math.log(pixelWidth / TILE_SIZE) / Math.LN2)
  return zoom
}
</script>

<template>
  <div>
    <div>
      <div class="tw-h-[70vh] tw-w-[100%]" id="map"></div>
    </div>
    <v-row justify="center" class="my-4">
      <v-btn color="light-blue lighten-3" class="tw-mr-2" @click="togglePollenHeatmapOpacity"
        >Toggle Pollen Layer</v-btn
      >
      <v-btn color="light-blue lighten-3" class="tw-mr-2" @click="toggleAirHeatmapOpacity"
        >Toggle Air Quality Layer</v-btn
      >
    </v-row>
  </div>
</template>

<style scoped></style>
