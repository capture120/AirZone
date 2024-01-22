<script setup lang="ts">
import { useLocationStore } from '@/stores/location';
import type { Location } from '@/types/global-types';
import { onMounted, ref } from 'vue';
import SavedLocationMapVue from '@/components/GoogleMap/SavedLocationMap.vue';
const locationID = window.location.pathname.split('/')[2];
const savedLocation = ref<Location>();
onMounted(async () => {
    const locationStore = useLocationStore();
    await locationStore.updateLatestLocations();
    savedLocation.value = locationStore.getLocationById(locationID) as Location;
})
</script>

<template>
  <div v-if="savedLocation">
    <h1>{{ savedLocation.title }}</h1>
    <p>{{ savedLocation.boundNorth }} {{ savedLocation.boundSouth }}</p>
    <!-- <SavedLocationMapVue :location="savedLocation"/> -->
  </div>

</template>

<style>
</style>