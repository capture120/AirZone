<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import { onMounted } from 'vue'

// @ts-ignore
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
// @ts-ignore
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID as string

const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY })

// alt cords
const position = { lat: -33, lng: 151 }

onMounted(async () => {
  const { Map } = await loader.importLibrary('maps')
  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    'marker'
  )) as google.maps.MarkerLibrary
  const map = new Map(document.getElementById('map') as HTMLElement, {
    zoom: 4,
    center: position,
    mapId: GOOGLE_MAP_ID,
  })

  new AdvancedMarkerElement({
    map: map,
    position: position,
    title: 'The MITRE Corporation'
  })

  // Define the heatmap tile URL pattern
  let heatmapTileURL =
    'https://pollen.googleapis.com/v1/mapTypes/TYPE/heatmapTiles/{z}/{x}/{y}?key=API_KEY'

  /*
  TREE_UPI
  GRASS_UPI
  WEED_UPI
  */
  heatmapTileURL = heatmapTileURL.replace('TYPE', 'GRASS_UPI')
  heatmapTileURL = heatmapTileURL.replace('API_KEY', GOOGLE_MAPS_API_KEY)

  // Create a new ImageMapType with the heatmap tile URL
  let pollenHeatmapLayer = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
      // @ts-ignore
      return heatmapTileURL.replace('{z}', zoom).replace('{x}', coord.x).replace('{y}', coord.y)
    },
    tileSize: new google.maps.Size(256, 256)
  })
  pollenHeatmapLayer.setOpacity(0.5);

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
        pollenHeatmapLayer.setOpacity(.7)
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

  /*
  function changeRadius(): void {
    heatmap.set("radius", heatmap.get("radius") ? null : 20);
  }

  document
    .getElementById("change-radius")!
    .addEventListener("click", changeRadius);
  */
})
</script>

<template>
  <div id="floating-panel">
    <button id="toggle-pollen-heatmap">Toggle Heatmap</button>
    <button id="toggle-opacity">Toggle opacity</button>
    <!-- <button id="change-radius">Change radius</button> -->
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