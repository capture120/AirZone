<script setup lang="ts">
import NavBar from './components/NavBar.vue'
</script>

<template>
  <v-app>
    <v-main>
      <div class="tw-min-h-screen tw-flex tw-flex-col">
        <NavBar/>
        <router-view class="tw-mt-[2%]"/>
      </div>
    </v-main>
  </v-app>
</template>
