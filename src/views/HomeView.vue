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
      <VRow v-if="authStore.$state.session.user" class="d-flex align-center justify-space-evenly
" rounded rounded-circle>
        <VCol
          v-for="location in user.savedLocations"
          v-bind:key="location._id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="tw-my-6"
        >
          <AirReportCard :location="location" />
        </VCol>
      </VRow>
    </v-container>
  </div>
</template>
@/stores/location
