<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { type User } from '@/types/global-types'
import { useRouter } from 'vue-router'
import { VRow, VCol } from 'vuetify/components'
import Airzonelogo2 from '@/assets/Airzonelogo2.png'

const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const router = useRouter()

async function Register(): Promise<boolean | undefined> {
  if (username.value === '' || password.value === '') {
    alert('Must enter valid username/password')
    return false
  }
  await authStore.register({ username: username.value, password: password.value } as User)
  const user = authStore.$state.session.user
  if (!user) {
    console.log('Registration Failed.')
  }
  router.push({ path: '/' })
}
</script>

<template>
  <VRow class="tw-flex tw-min-h-[750px] tw-grow">
    <VCol lg="6" class="tw-flex tw-grow tw-items-center tw-justify-center tw-pr-5 tw-mt-24">
      <div class="tw-flex tw-w-[90%] tw-flex-col tw-justify-center tw-pb-10 xl:tw-w-[60%]">
        <h1 class="tw-mb-12 tw-font-serif tw-text-4xl tw-font-bold">Welcome to Airzone</h1>

        <VTextField
          v-model="username"
          class="!tw-mb-5"
          label="Username"
          variant="outlined"
          fullWidth
        />
        <VTextField
          v-model="password"
          type="password"
          label="Password"
          fullWidth
          variant="outlined"
          class="tw-mb-0"
        />
        <VBtn
          class="tw-mb-5 tw-mt-5"
          color="black"
          rounded
          block
          large
          @click="Register"
          style="background-color: #000000"
        >
          Create Account
        </VBtn>
      </div>
    </VCol>
    <VCol
      item
      sm="6"
      class="hidden tw-mt-1 tw-items-center tw-justify-center tw-pl-4 lg:tw-flex"
      max-width="auto"
    >
      <v-img :src="Airzonelogo2" rounded rounded-circle class="tw-max-h-[20%] tw-max-w-[20%]" />
    </VCol>
  </VRow>
</template>
