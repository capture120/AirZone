<script setup lang="ts">

import { Loader } from '@googlemaps/js-api-loader'
import { onMounted } from 'vue';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID;

const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY })
// MITRE cords
// const position = { lat: -25.344, lng: 131.031 };
// San Francisco cords
// const position = { lat: 37.774546, lng: -122.433523};

// alt cords
const position = {lat: -33, lng: 151}

onMounted(async () => {
  const { Map } = await loader.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
  // const { HeatmapLayer } = await google.maps.importLibrary("visualization") as google.maps.VisualizationLibrary;
  const map = new Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 4,
      center: position,
      mapId: GOOGLE_MAP_ID,
    }
  );

  new AdvancedMarkerElement({
    map: map,
    position: position,
    title: 'The MITRE Corporation'
  });

  // const heatmap = new HeatmapLayer({
  //   data: getPoints(),
  //   map: map,
  // });

  // Define the heatmap tile URL pattern
  let heatmapTileURL = 'https://pollen.googleapis.com/v1/mapTypes/TYPE/heatmapTiles/{z}/{x}/{y}?key=API_KEY';

  /*
  TREE_UPI
  GRASS_UPI
  WEED_UPI
  */
  heatmapTileURL = heatmapTileURL.replace('TYPE', 'TREE_UPI');
  heatmapTileURL = heatmapTileURL.replace('API_KEY', GOOGLE_MAPS_API_KEY);

  // Create a new ImageMapType with the heatmap tile URL
  let heatmapLayer = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      // @ts-ignore
      return heatmapTileURL.replace('{z}', zoom).replace('{x}', coord.x).replace('{y}', coord.y);
    },
    tileSize: new google.maps.Size(256, 256),
  });

  // Overlay the heatmap tiles on the map
  map.overlayMapTypes.insertAt(0, heatmapLayer);

  /*
  function toggleHeatmap(): void {
  heatmap.setMap(heatmap.getMap() ? null : map);
  }

  function changeGradient(): void {
    const gradient = [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 0, 91, 1)",
      "rgba(127, 0, 63, 1)",
      "rgba(191, 0, 31, 1)",
      "rgba(255, 0, 0, 1)",
    ];

    heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
  }

  function changeOpacity(): void {
    heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
  }

  function changeRadius(): void {
    heatmap.set("radius", heatmap.get("radius") ? null : 20);
  }

  document
    .getElementById("toggle-heatmap")!
    .addEventListener("click", toggleHeatmap);
  document
    .getElementById("change-gradient")!
    .addEventListener("click", changeGradient);
  document
    .getElementById("change-opacity")!
    .addEventListener("click", changeOpacity);
  document
    .getElementById("change-radius")!
    .addEventListener("click", changeRadius);
  */
});
</script>

<template>
  <div id="floating-panel">
    <button id="toggle-heatmap">Toggle Heatmap</button>
    <button id="change-gradient">Change gradient</button>
    <button id="change-radius">Change radius</button>
    <button id="change-opacity">Change opacity</button>
  </div>
  <div>
    <div class="google-map" id="map" ></div>
  </div>
</template>


<style scoped>

.google-map {
  width: 100%;
  height:80vh;
}

</style>
