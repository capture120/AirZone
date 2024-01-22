import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserSession } from '@/types/global-types'
import * as authApi from '../api/auth-api'

export const useAuthStore = defineStore('user', () => {
  /* State */
  const storageUser: User | null = JSON.parse(localStorage.getItem('user') as string);
  const session = reactive({ user: storageUser } as UserSession)
  // console.log(JSON.stringify(storageUser))

  /* Getters */
  const getUsername = computed(async () => {
    const response = await authApi.authenticate()
    const authenticated = response.status === 200;
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
    const response = await authApi.register(userDetails.username, userDetails.password);
    const registeredUser = response.data as User;
    if (registeredUser) {
      session.user = registeredUser;
      session.csrfToken = response.headers['x-csrf-token'];
      localStorage.setItem('user', JSON.stringify(session.user));
    }
  }

  async function signin(userDetails: User) {
    if (userDetails.username == '' || userDetails.password == '' || !userDetails.password) {
      return;
    }
    const response = await authApi.signin(userDetails.username, userDetails.password)
    const signedinUser = response.data as User;
    if (signedinUser) {
      session.user = signedinUser;
      session.csrfToken = response.headers['x-csrf-token'];
      localStorage.setItem('user', JSON.stringify(session.user));
    }
  }

  async function logout() {
    const logoutSuccess = await authApi.logout()
    if (logoutSuccess) {
      session.user = null;
      session.csrfToken = null;
      localStorage.removeItem('user');
    } else {
      throw new Error('Error occurred during user logout.')
    }
  }

  return { session: session, getUsername, register, signin, logout }
})
