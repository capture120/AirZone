import axios from 'axios'
import type { Location, User } from '@/types/global-types'

const apiUrl = import.meta.env.VITE_REST_API_URL as string
const locationApi = axios.create({
  withCredentials: true,
  baseURL: apiUrl + '/user'
})

export const saveLocation = async (location: Location) => {
  const response = await locationApi.put('/saveLocation', location)
  return response.data as Location
}

export const details = async () => {
  const response = await locationApi.get(`/details`)
  return response.data as User
}
