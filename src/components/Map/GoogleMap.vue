<script setup lang="ts">

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
