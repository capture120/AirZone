<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useLocationStore } from '@/stores/locations';
import type { LocationSession } from '@/types/global-types';

const authStore = useAuthStore();
const locationStore = useLocationStore();
const user = reactive({} as LocationSession)

onMounted(async () => {
  const userLocations = await locationStore.getSavedLocations;
  user.savedLocations = userLocations;
})
</script>

<template>
  <div class="home">
    <h1>This is the Home Page</h1>
  </div>
  <div>
    <ul v-if="authStore.$state.session.user">
        <li v-for="location in user.savedLocations" v-bind:key="location._id">
          {{ location.lat }} {{ location.lng }}
        </li>
    </ul>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .home {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
