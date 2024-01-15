<script setup lang="ts">
// import '@googlemaps/extended-component-library/overlay_layout.js';
// import '@googlemaps/extended-component-library/api_loader.js';

import { Loader } from '@googlemaps/js-api-loader'
import { onMounted } from 'vue';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID;

const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY })
const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
const position = { lat: -25.344, lng: 131.031 };

onMounted(async () => {
  const { Map } = await loader.importLibrary("maps");
  const map = new Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 15,
      center: position,
      mapId: GOOGLE_MAP_ID,
    }
  );

  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: 'The MITRE Corporation'
  });
});
</script>

<template>
  <!-- <gmpx-api-loader key="AIzaSyAbcRcBKY1Q5knGDie9IVfviuhXRI1zAaI"/>
  <gmpx-split-layout>
    <gmpx-place-overview slot="fixed" place="ChIJ39Y-tdg1fYcRQcZcBb499do"></gmpx-place-overview>
    <gmp-map slot="main" center="43.880,-103.459" zoom="10" map-id="eed0a5d7278df36b">
      <gmp-advanced-marker position="43.880,-103.459"></gmp-advanced-marker>
    </gmp-map>
  </gmpx-split-layout> -->
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
