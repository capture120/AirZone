<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
// import { useLocationStore } from '@/stores/location';
import type { LocationSession } from '@/types/global-types';

const authStore = useAuthStore();
// const locationStore = useLocationStore();
const user = reactive({} as LocationSession)

onMounted(async () => {
  // if (await authStore.getUsername) {
  //   await locationStore.updateLatestLocations();
  //   user.savedLocations = locationStore.getSavedLocations;
  // }
})
</script>

<template>
  <div class="home">
    <h1>This is the Home Page</h1>
  </div>
  <div>
    <ul v-if="authStore.$state.session.user" >
        <li v-for="location in user.savedLocations" v-bind:key="location._id">
          <a :href="'/location/' + location._id">{{ location.title }}</a>
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

ul, li {
  margin-left: 0;
  padding-left: 0;
}
</style>