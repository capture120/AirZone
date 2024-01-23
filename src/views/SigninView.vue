<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { type User } from '@/types/global-types'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const router = useRouter()
const registerLink = '/register'

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
    alert('Invalid username or password.')
    username.value = ''
    password.value = ''
  }
}
</script>

<template>
  <div>Register</div>
  <div>
    <button @click="signin">Sign-in</button>
    <label :ref="username">Username</label>
    <input v-model="username" :required="true" />
    <label :ref="password">Password</label>
    <input v-model="password" :required="true" type="password" />
    <div>New User? <a v-bind:href="registerLink"> Register Here </a></div>
  </div>
</template>
