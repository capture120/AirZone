<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLocationStore } from '@/stores/location'
import type { LocationSession } from '@/types/global-types'
import { VList } from 'vuetify/components'
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
  <v-container class="tw-rounded-lg">
    <div class="tw-rounded-xl tw-pt-5">
      <VList v-if="authStore.$state.session.user" class="tw-list-none" rounded rounded-circle>
        <VListItem v-for="location in user.savedLocations" v-bind:key="location._id">
          <router-link :to="'/location/' + location._id">
            <div
              class="tw-mx-auto tw-flex tw-max-w-sm tw-items-center tw-space-x-4 tw-rounded-xl tw-bg-white tw-p-6 tw-shadow-md"
            >
              <div class="tw-flex-shrink-0">
                <!-- <img class="h-12 w-12" src="@/assets/" alt="status image" /> -->
              </div>
              <div>
                <div class="tw-text-xl tw-font-medium tw-text-black">{{ location.title }}</div>
                <p class="tw-text-gray-500">{{ location.lat }} {{ location.lng }}</p>
              </div>
            </div>
          </router-link>
        </VListItem>
      </VList>
    </div>
  </v-container>
</template>
@/stores/location
