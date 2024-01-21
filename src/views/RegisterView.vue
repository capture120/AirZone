<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { type User } from '@/types/global-types'
import { useRouter } from 'vue-router'

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
  <div>Register</div>
  <div>
    <button @click="Register">Register</button>
    <label :ref="username">Username</label>
    <input v-model="username" :required="true" />
    <label :ref="password">Password</label>
    <input v-model="password" :required="true" type="password" />
  </div>
</template>

<style></style>
