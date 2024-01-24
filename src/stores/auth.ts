import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserSession } from '@/types/global-types'
import * as authApi from '../api/auth-api'
import type { AxiosResponse } from 'axios'

export const useAuthStore = defineStore('user', () => {
  /* State */
  const storageUser: User | null = JSON.parse(localStorage.getItem('user') as string)
  const session = reactive({ user: storageUser } as UserSession)

  /* Getters */
  async function authenticate() {
    const response = await authApi.authenticate()
    const authenticated = response.status === 200
    if (authenticated && session.user) {
      return session.user.username
    } else {
      return null
    }
  }

  /* Actions */
  async function register(userDetails: User) {
    if (
      userDetails.username == '' ||
      userDetails.password == '' ||
      !userDetails.password ||
      session.user
    ) {
      return
    }
    const response = await authApi.register(userDetails.username, userDetails.password)
    const registeredUser = response.data as User
    if (registeredUser) {
      session.user = registeredUser
      session.csrfToken = response.headers['csrfToken']
      localStorage.setItem('user', JSON.stringify(session.user))
    }
  }

  async function signin(userDetails: User): Promise<AxiosResponse<any, any> | null> {
    const response = await authApi.signin(userDetails.username, userDetails.password as string)
    if (response?.status === 200) {
      const signedinUser = response.data as User
      session.user = signedinUser
      session.csrfToken = response.headers['csrfToken']
      localStorage.setItem('user', JSON.stringify(session.user))
    }
    return response
  }

  async function logout() {
    await authApi.logout()
    session.user = null
    session.csrfToken = null
    localStorage.removeItem('user')
  }

  return {
    session: session,
    authenticate: authenticate,
    register: register,
    signin: signin,
    logout: logout
  }
})
