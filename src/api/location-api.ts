import axios from 'axios'
import type { Location, User } from '@/types/global-types'
import { useAuthStore } from '@/stores/auth';

const apiUrl = import.meta.env.VITE_REST_API_URL as string
const locationApi = axios.create({
  withCredentials: true,
  baseURL: apiUrl + '/user',
})

export const saveLocation = async (location: Location) => {
  const authStore = useAuthStore()
  const response = await locationApi.put('/saveLocation', location, {
    headers: {
      csrfToken: authStore.$state.session.csrfToken
    }
  })
  return response.data as Location
}

export const details = async () => {
  const authStore = useAuthStore()
  const response = await locationApi.get(`/details`, {
    headers: {
      csrfToken: authStore.$state.session.csrfToken
    }
  })
  return response.data as User
}