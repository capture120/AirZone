<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLocationStore } from '@/stores/location'
import type { LocationSession } from '@/types/global-types'
import { VList } from 'vuetify/components'
import AirReportCard from '@/components/AirReportCard.vue'
const authStore = useAuthStore()
const locationStore = useLocationStore()
const user = reactive({} as LocationSession)

onMounted(async () => {
  if (authStore.$state.session.user) {
    await locationStore.updateLatestLocations()
    user.savedLocations = locationStore.getSavedLocations
  }
})
</script>

<template>
  <div class="tw-max-w-80%">
    <v-container class="tw-rounded-lg">
      <div class="tw-flex tw-justify-center">
        <h1 class="tw-text-4xl tw-font-bold tw-font-serif tw-m-6">Locations</h1>
      </div>
      <VRow
        v-if="authStore.$state.session.user"
        class="d-flex align-center justify-space-evenly"
        rounded
        rounded-circle
      >
        <VCol
          v-for="location in user.savedLocations"
          v-bind:key="location._id"
          class="tw-my-6"
          cols="4"
          md="4"
          sm="6"
          xs="12"
        >
          <AirReportCard :location="location" />
        </VCol>
      </VRow>
    </v-container>
  </div>
</template>
@/stores/location
