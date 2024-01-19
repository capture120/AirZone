import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/global-types'
import axios from 'axios'

const REST_API_URL = import.meta.env.VITE_REST_API_URL

export const useAuthStore = defineStore('user', () => {
  /* State */
  const user = reactive(null as unknown as User)
  
  /* Getters */
  const getUsername = computed(() => {
    if (user) {
      return user.username;
    } else {
      return null;
    }
  });
  
  /* Actions */
  function register(userDetails: User) {
    if (userDetails.username == '' || userDetails.password == '' || !userDetails.password) {
      return;
    }

    axios.post(REST_API_URL + 'user')
  }
  
  function signin() {
    
  }

  function logout() {
    
  }

  return { user, getUsername, register, signin, logout}
})
