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
const showAlert = ref(false)

async function signin() {
  if (username.value === '') {
    alert('Must enter a valid username.')
    return
  } else if (password.value === '') {
    alert('Must enter a valid password.')
    return
  }
  const response = await authStore.signin({
    username: username.value,
    password: password.value
  } as User)
  if (response?.status === 200) {
    router.push({ path: '/' })
  } else {
    showAlert.value = true
    username.value = ''
    password.value = ''
  }
}
</script>

<template>
  <VRow class="tw-grow tw-flex tw-min-h-[650px]">
    <v-alert
      v-model="showAlert"
      type="error"
      closable
      close-label="Close Alert"
      elevation="2"
      icon="mdi-alert-circle-outline"
      @input="() => (showAlert = false)"
      @click:close="() => (showAlert = false)"
    >
      Invalid username or password.
    </v-alert>
    <VCol lg="6" class="tw-flex tw-grow tw-justify-center tw-items-center tw-pr-5">
      <div class="tw-flex tw-flex-col tw-justify-center tw-pb-20 tw-w-[90%] xl:tw-w-[60%]">
        <h1 class="tw-text-4xl tw-font-bold tw-font-serif tw-mb-12">Sign In</h1>

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
        <VRow container class="!tw-mb-10 !tw-mt-0 tw-justify-between">
          <VCol item>
            <div display="inline" class="tw-text-black tw-text-[12px] tw-py-1">
              Don't have an account? &nbsp;
              <a
                href="/register"
                class="tw-py-1 tw-text-black tw-text-[12px]"
                style="
                  text-decoration: underline;
                  text-underline-offset: 3px;
                  text-decoration-color: black;
                "
              >
                Register here
              </a>
            </div>
          </VCol>
          <v-spacer></v-spacer>
          <VCol item>
            <a
              href="/"
              class="tw-py-1 tw-text-black tw-text-[12px]"
              style="
                text-decoration: underline;
                text-underline-offset: 3px;
                text-decoration-color: black;
              "
            >
              Forgot Password
            </a>
          </VCol>
        </VRow>
        <VBtn
          class="tw-mb-5"
          color="black"
          rounded
          block
          large
          @click="signin"
          style="background-color: #000000"
        >
          Sign In
        </VBtn>
      </div>
    </VCol>
    <VCol
      item
      sm="6"
      class="md:tw-flex tw-justify-center tw-items-center tw-pl-4 tw-hidden"
    >
      <v-img :src="Airzonelogo2" rounded rounded-circle max-height="80%"/>
    </VCol>
  </VRow>
</template>

<style>
.v-alert {
  position: fixed;
  top: 18%;
  left: 24%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
}
</style>
