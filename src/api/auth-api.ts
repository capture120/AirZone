import axios from 'axios'
import { useAuthStore } from '@/stores/auth';
// import type { User } from '@/types/global-types'

const authStore = useAuthStore()
const apiUrl = import.meta.env.VITE_REST_API_URL as string
const authApi = axios.create({
  withCredentials: true,
  baseURL: apiUrl + '/user'
})

// Add an interceptor to attach CSRF token to the header
authApi.interceptors.request.use((config) => {
  if (authStore.$state.session.user) {
    const csrfToken = authStore.$state.session.csrfToken; 
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

export const register = async (username: string, password: string) => {
  const response = await authApi.post(`/register`, { username, password, savedLocations: [] })
  return response
}

export const signin = async (username: string, password: string) => {
  const response = await authApi.post(`/signin`, { username, password })
  return response
}

export const logout = async (): Promise<boolean> => {
  const response = await authApi.post(`/logout`)
  return response.status === 200
}

export const authenticate = async () => {
  const response = await authApi.post(`/authenticate`)
  return response
}