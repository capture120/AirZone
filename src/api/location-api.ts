import axios from 'axios'
import type { Location, User } from '@/types/global-types'
import { useAuthStore } from '@/stores/auth'

const apiUrl = import.meta.env.VITE_REST_API_URL as string
const userLocationsApi = axios.create({
  withCredentials: true,
  baseURL: apiUrl + '/user'
})
const locationApi = axios.create({
  withCredentials: true,
  baseURL: apiUrl + '/location'
})

export const saveLocation = async (location: Location) => {
  const authStore = useAuthStore()
  const response = await userLocationsApi.put('/saveLocation', location, {
    headers: {
      csrfToken: authStore.$state.session.csrfToken
    }
  })
  return response.data as Location
}

export const details = async () => {
  const authStore = useAuthStore()
  const response = await userLocationsApi.get(`/details`, {
    headers: {
      csrfToken: authStore.$state.session.csrfToken
    }
  })
  return response.data as User
}

export const removeLocation = async (locationId: string) => {
  const authStore = useAuthStore()
  const response = await userLocationsApi.delete(`/removeLocation/${locationId}`, {
    headers: {
      csrfToken: authStore.$state.session.csrfToken
    }
  })
  return response.data as User
}

export const findLocationById = async (id: string) => {
  const authStore = useAuthStore()
  const response = await locationApi.get(`/${id}`, {
    headers: {
      csrfToken: authStore.$state.session.csrfToken
    }
  })
  return response.data as Location
}
