<script setup lang="ts">

import { Loader } from '@googlemaps/js-api-loader'
import { onMounted } from 'vue';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID;

const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY })
// const position = { lat: -25.344, lng: 131.031 };
const position = { lat: 37.774546, lng: -122.433523};

function getPoints():  google.maps.MVCArray<google.maps.LatLng | google.maps.visualization.WeightedLocation> | (google.maps.LatLng | google.maps.visualization.WeightedLocation)[] | null | undefined {
  return [
    {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
    new google.maps.LatLng(37.782, -122.445),
    {location: new google.maps.LatLng(37.782, -122.443), weight: 2},
    {location: new google.maps.LatLng(37.782, -122.441), weight: 3},
    {location: new google.maps.LatLng(37.782, -122.439), weight: 2},
    new google.maps.LatLng(37.782, -122.437),
    {location: new google.maps.LatLng(37.782, -122.435), weight: 0.5},

    {location: new google.maps.LatLng(37.785, -122.447), weight: 3},
    {location: new google.maps.LatLng(37.785, -122.445), weight: 2},
    new google.maps.LatLng(37.785, -122.443),
    {location: new google.maps.LatLng(37.785, -122.441), weight: 0.5},
    new google.maps.LatLng(37.785, -122.439),
    {location: new google.maps.LatLng(37.785, -122.437), weight: 2},
    {location: new google.maps.LatLng(37.785, -122.435), weight: 3}
  ];
}

onMounted(async () => {
  const { Map } = await loader.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
  const { HeatmapLayer } = await google.maps.importLibrary("visualization") as google.maps.VisualizationLibrary;
  const map = new Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 7,
      center: position,
      mapId: GOOGLE_MAP_ID,
    }
  );

  new AdvancedMarkerElement({
    map: map,
    position: position,
    title: 'The MITRE Corporation'
  });

  const heatmap = new HeatmapLayer({
    data: getPoints(),
    map: map,
  });

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
