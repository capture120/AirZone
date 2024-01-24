<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import { onMounted, ref } from 'vue'
import { type Location, type SelectionBoundary } from '../../types/global-types'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID as string
const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY })
let map: google.maps.Map
let pollenHeatmapTileURL: string
let airHeatmapTileUrl: string
let boundaryVisualization: google.maps.Rectangle
let pollenHeatmapLayer: google.maps.ImageMapType
let airHeatmapLayer: google.maps.ImageMapType
let pollenLayerOn = ref(true)
let airLayerOn = ref(false)
const props = defineProps<{
  location: Location
}>()
const bounds = new google.maps.LatLngBounds(
  new google.maps.LatLng(props.location.boundSouth, props.location.boundWest),
  new google.maps.LatLng(props.location.boundNorth, props.location.boundEast)
)

onMounted(async () => {
  if (props.location) {
    const { Map } = await loader.importLibrary('maps')
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary
    map = new Map(document.getElementById('map') as HTMLElement, {
      // zoom: props.location.zoom,
      // center: { lat: props.location.lat, lng: props.location.lng },
      mapId: GOOGLE_MAP_ID,
      minZoom: props.location.zoom,
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

    new AdvancedMarkerElement({
      map: map,
      position: { lat: props.location.lat, lng: props.location.lng },
      title: props.location.title
    })

    boundaryVisualization = new google.maps.Rectangle({
      map: map,
      bounds: bounds,
      editable: false,
      draggable: false,
      visible: true
    })

    /* HEATMAP */
    // const pollenType = 'TREE_UPI'
    // const airQualityType = 'UAQI_RED_GREEN'
    // pollenHeatmapTileURL = `https://pollen.googleapis.com/v1/mapTypes/${pollenType}/heatmapTiles/{z}/{x}/{y}?key=${GOOGLE_MAPS_API_KEY}`
    // airHeatmapTileUrl = `https://airquality.googleapis.com/v1/mapTypes/${airQualityType}/heatmapTiles/{z}/{x}/{y}?key=${GOOGLE_MAPS_API_KEY}`

    // // Create a new ImageMapType with the heatmap tile URL
    // pollenHeatmapLayer = new google.maps.ImageMapType({
    //   getTileUrl: function (coord, zoom) {
    //     let north = map.getBounds()?.getNorthEast().lat() as number
    //     let south = map.getBounds()?.getSouthWest().lat() as number
    //     if (north > 80 || south < -80) {
    //       return ''
    //     }
    //     // @ts-ignore
    //     return pollenHeatmapTileURL
    //       .replace('{z}', zoom.toString())
    //       .replace('{x}', coord.x.toString())
    //       .replace('{y}', coord.y.toString())
    //   },
    //   tileSize: new google.maps.Size(256, 256)
    // })
    // pollenHeatmapLayer.setOpacity(0.5)
    // map.overlayMapTypes.insertAt(1, pollenHeatmapLayer)

    // airHeatmapLayer = new google.maps.ImageMapType({
    //   getTileUrl: function (coord, zoom) {
    //     let north = map.getBounds()?.getNorthEast().lat() as number
    //     let south = map.getBounds()?.getSouthWest().lat() as number
    //     if (north > 80 || south < -80) {
    //       return ''
    //     }
    //     // @ts-ignore
    //     return airHeatmapTileUrl
    //       .replace('{z}', zoom.toString())
    //       .replace('{x}', coord.x.toString())
    //       .replace('{y}', coord.y.toString())
    //   },
    //   tileSize: new google.maps.Size(256, 256)
    // })
    // airHeatmapLayer.setOpacity(0)
    // map.overlayMapTypes.insertAt(0, airHeatmapLayer)

    // Calculate map dimensions in pixels
    map.fitBounds(bounds, 0)
  }
})

function calculateMapDimensions() {
  const bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(props.location.boundSouth, props.location.boundWest),
    new google.maps.LatLng(props.location.boundNorth, props.location.boundEast)
  )

  const projection = map.getProjection()
  if (!projection) {
    console.log('ohno')
    return { width: 0, height: 0 }
  }
  const sw = projection.fromLatLngToPoint(bounds.getSouthWest())
  const ne = projection.fromLatLngToPoint(bounds.getNorthEast())

  if (!sw || !ne) {
    console.log('oops')
    return { width: 0, height: 0 }
  }

  const width = Math.abs(ne.x - sw.x) * 256 // Assuming tile size of 256x256 pixels
  const height = Math.abs(ne.y - sw.y) * 256

  return { width, height }
}

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
  <div>
    <div>
      <div class="tw-h-[80vh] tw-w-[100%]" id="map"></div>
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
