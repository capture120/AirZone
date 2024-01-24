<script setup lang="ts">
import { useLocationStore } from '@/stores/location'
import type { Location } from '@/types/global-types'
import { onMounted, ref } from 'vue'
import SavedLocationMapVue from '@/components/GoogleMap/SavedLocationMap.vue'
const locationID = window.location.pathname.split('/')[2]
const savedLocation = ref<Location>()
const isMounted = ref(false)
onMounted(async () => {
  const locationStore = useLocationStore()
  await locationStore.updateLatestLocations()
  savedLocation.value = (await locationStore.getLocationById(locationID)) as Location
  isMounted.value = true
})

async function handleDeleteLocation() {
  const locationStore = useLocationStore()
  await locationStore.deleteLocation(locationID)
  window.location.href = '/'
}
</script>

<template>
  <v-container v-if="savedLocation" class="tw-rounded-lg">
    <div class="tw-text-5xl tw-flex tw-justify-center tw-mb-1">{{ savedLocation.title }}</div>
    <SavedLocationMapVue v-if="isMounted" :location="savedLocation" />
    <div class="tw-flex tw-justify-center">
      <VBtn @click="handleDeleteLocation" color="red" class="hoverable">Remove Saved Location</VBtn>
    </div>
  </v-container>
</template>
