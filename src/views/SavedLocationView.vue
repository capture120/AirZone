<script setup lang="ts">
import { useLocationStore } from '@/stores/location';
import type { Location } from '@/types/global-types';
import { onMounted, ref } from 'vue';

const locationID = window.location.pathname.split('/')[2];
const mapEmbedUrl = ref('')
let savedLocation: Location | null;

onMounted(async () => {
    const locationStore = useLocationStore();
    await locationStore.updateLatestLocations();
    savedLocation = locationStore.getLocationById(locationID);
    mapEmbedUrl.value = `https://www.google.com/maps/embed/v1/view
      ?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      &center=${ savedLocation?.lat },${savedLocation?.lng}
      &zoom=${ savedLocation?.zoom}
      &maptype=roadmap`;
      console.log(mapEmbedUrl.value)
})
</script>

<template>
  <div >
    <h1>{{ savedLocation?.title }}</h1>
  </div>
  <iframe
    width="1800"
    height="1200"
    style="border:0"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    :src="mapEmbedUrl">
    </iframe>
</template>

<style>
</style>
