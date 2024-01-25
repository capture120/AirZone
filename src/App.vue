<script setup lang="ts">
import NavBar from './components/NavBar.vue'
</script>

<template>
  <v-app>
    <v-main>
      <div class="tw-flex tw-min-h-screen tw-flex-col">
        <NavBar />
        <router-view class="tw-mt-[4%]" />
      </div>
    </v-main>
  </v-app>
</template>
