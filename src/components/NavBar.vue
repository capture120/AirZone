<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '../stores/auth'
import logo from '@/assets/navbar/AirzoneLogo.png'

const auth = useAuthStore()

async function logout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <nav class="tw-fixed tw-z-20 tw-w-screen tw-shadow-md">
    <v-toolbar :elevation="3">
      <v-toolbar-items class="sm:tw-pl-8" prominent>
        <v-btn to="/">
          <img :src="logo" class="tw-w-14 md:tw-m-2 md:tw-w-16" />
        </v-btn>
        <v-btn to="/map"> <p class="md:tw-m-2">Map</p></v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items prominent class="sm: tw-mr-6">
        <v-btn v-if="!auth.$state.session.user" to="/signin">Sign-in</v-btn>
        <v-btn v-if="auth.$state.session.user" @click="logout">Log Out</v-btn>
        <v-btn flat>
          <label class="tw-pr-3" v-if="auth.$state.session.user">{{
            auth.$state.session.user?.username
          }}</label>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </nav>
</template>
<style scoped></style>
