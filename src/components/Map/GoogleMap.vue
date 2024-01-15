<script setup lang="ts">
  import { Loader } from "@googlemaps/js-api-loader"
  let map: google.maps.Map;
  async function initMap(): Promise<void> {
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    map = new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }

  initMap();
  const loader = new Loader({
    apiKey: "AIzaSyAbcRcBKY1Q5knGDie9IVfviuhXRI1zAaI",
    version: "weekly",
  });

  loader.load().then(async () => {
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    map = new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  });
</script>

<template>
  <div class="greetings">
    <h1 class="green">Hello World</h1>
    <gmp-map center="42.50435256958008,-71.23621368408203" zoom="14" map-id="DEMO_MAP_ID">
      <gmp-advanced-marker position="42.50435256958008,-71.23621368408203" title="My location">
      </gmp-advanced-marker>
    </gmp-map>
  </div>
</template>

<style scoped>
  gmp-map {
    height: 100%;
  }
</style>
