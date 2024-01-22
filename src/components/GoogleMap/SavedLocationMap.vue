<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import { onMounted } from 'vue'
import { type Location } from '../../types/global-types'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID as string
const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY });
let map: google.maps.Map
let heatmapTileURL: string
let pollenHeatmapLayer: google.maps.ImageMapType

const props = defineProps<{
  location: Location
}>()

onMounted(async () => {
  if (props.location)
  {
    console.log(props.location.zoom)
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
      gestureHandling: 'none',
    })

    /* HEATMAP */
    const pollenType = 'TREE_UPI'
    heatmapTileURL = `https://pollen.googleapis.com/v1/mapTypes/${pollenType}/heatmapTiles/{z}/{x}/{y}?key=${GOOGLE_MAPS_API_KEY}`

    // Create a new ImageMapType with the heatmap tile URL
    pollenHeatmapLayer = new google.maps.ImageMapType({
      getTileUrl: function (coord, zoom) {
        console.log('called')
        let north = map.getBounds()?.getNorthEast().lat() as number
        let south = map.getBounds()?.getSouthWest().lat() as number
        if (north > 80 || south < -80) {
          return ''
        }
        // @ts-ignore
        return heatmapTileURL.replace('{z}', zoom).replace('{x}', coord.x).replace('{y}', coord.y)
      },
      tileSize: new google.maps.Size(256, 256)
    })
    pollenHeatmapLayer.setOpacity(0.5)
    map.overlayMapTypes.insertAt(0, pollenHeatmapLayer)
  }
})





</script>

<template>
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