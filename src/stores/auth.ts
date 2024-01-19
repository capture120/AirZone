import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/global-types'
import axios from 'axios'

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

    axios.post(import.meta.env)
  }
  
  function signin() {
    
  }

  function logout() {
    
  }

  return { user, getUsername, }
})
