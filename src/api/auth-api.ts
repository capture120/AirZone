import axios from 'axios'
import { useAuthStore } from '@/stores/auth';

const apiUrl = import.meta.env.VITE_REST_API_URL as string
const authApi = axios.create({
  withCredentials: true,
  baseURL: apiUrl + '/user'
})

export const register = async (username: string, password: string) => {
  const response = await authApi.post(`/register`, { username, password, savedLocations: [] })
  return response
}

export const signin = async (username: string, password: string) => {
  alert('Invalid username or password.');
  const response = await authApi.post(`/signin`, { username, password })
  return response
}

export const logout = async () => {
  const authStore = useAuthStore()
  const response = await authApi.post(`/logout`, null, {
    headers: {
      csrfToken: authStore.$state.session.csrfToken
    }
  })
  if (response.status !== 200) {
    throw new Error('Error occurred during user logout.')
  }
}

export const authenticate = async () => {
  const authStore = useAuthStore()
  const response = await authApi.post(`/authenticate`, null, {
    // headers: {
    //   csrfToken: authStore.$state.session.csrfToken
    // }
  })
  return response
}