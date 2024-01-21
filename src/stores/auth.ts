import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserSession } from '@/types/global-types'
import * as authApi from '../api/auth-api'

export const useAuthStore = defineStore('user', () => {
  /* State */
  const session = reactive({ user: null } as UserSession)

  /* Getters */
  const getUsername = computed(async () => {
    const authenticated = await authApi.authenticate()
    if (authenticated && session.user) {
      return session.user.username
    } else {
      return null
    }
  })

  /* Actions */
  async function register(userDetails: User) {
    if (
      userDetails.username == '' ||
      userDetails.password == '' ||
      !userDetails.password ||
      session.user
    ) {
      return;
    }
    const registeredUser = await authApi.register(userDetails.username, userDetails.password);
    if (registeredUser) {
      session.user = registeredUser;
    }
  }

  async function signin(userDetails: User) {
    if (userDetails.username == '' || userDetails.password == '' || !userDetails.password) {
      return;
    }
    const signedinUser = await authApi.signin(userDetails.username, userDetails.password)
    if (signedinUser) {
      session.user = signedinUser;
    }
  }

  async function logout() {
    const logoutSuccess = await authApi.logout()
    if (logoutSuccess) {
      session.user = null
    } else {
      throw new Error('Error occurred during user logout.')
    }
  }

  return { session: session, getUsername, register, signin, logout }
})
