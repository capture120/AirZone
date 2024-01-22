<script setup lang="ts">
import { useLocationStore } from '@/stores/location';
import type { Location } from '@/types/global-types';
import { onMounted, ref } from 'vue';
import SavedLocationMapVue from '@/components/GoogleMap/SavedLocationMap.vue';
const locationID = window.location.pathname.split('/')[2];
const savedLocation = ref<Location>();
const isMounted = ref(false);
onMounted(async () => {
    const locationStore = useLocationStore();
    await locationStore.updateLatestLocations();
    savedLocation.value = await locationStore.getLocationById(locationID) as Location;
    isMounted.value = true;
})

async function handleDeleteLocation() {
    const locationStore = useLocationStore();
    await locationStore.deleteLocation(locationID);
    window.location.href = '/';
}
</script>

<template>
  <div v-if="savedLocation">
    <h1>{{ savedLocation.title }}</h1>
    <SavedLocationMapVue v-if="isMounted" :location="savedLocation"/>
    <button @click="handleDeleteLocation">Remove Saved Location</button>
  </div>

</template>

<style>
</style>