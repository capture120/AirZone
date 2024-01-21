import axios from 'axios'
import type { User } from '@/types/global-types'

const apiUrl = import.meta.env.VITE_REST_API_URL as string
const authApi = axios.create({
  withCredentials: true,
  baseURL: apiUrl + '/user'
})

export const register = async (username: string, password: string) => {
  const response = await authApi.post(`/register`, { username, password, savedLocations: [] })
  return response.data as User
}

export const signin = async (username: string, password: string) => {
  const response = await authApi.post(`/signin`, { username, password })
  return response.data as User
}

export const logout = async (): Promise<boolean> => {
  const response = await authApi.post(`/logout`)
  return response.status === 200
}

export const authenticate = async (): Promise<boolean> => {
  const response = await authApi.post(`/authenticate`)
  return response.status === 200
}