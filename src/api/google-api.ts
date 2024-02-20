import axios from 'axios'
import { type Location } from '@/types/global-types'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
const pollenStatsUrl = `https://pollen.googleapis.com/v1/forecast:lookup?key=${apiKey}`
const airQualityUrl = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`

const pollenApi = axios.create({
  baseURL: pollenStatsUrl
})

const airQualityApi = axios.create({
  baseURL: airQualityUrl
})

export const getPollenStats = async (location: Location) => {
  const response = await pollenApi.get(
    `&location.longitude=${location.lng}&location.latitude=${location.lat}&days=1`
  )

  return response
}

export const getAirQualityStats = async (location: Location) => {
  const response = await airQualityApi.post(
    '/saveLocation',
    {
      universalAqi: true,
      location: {
        latitude: location.lat,
        longitude: location.lng
      },
      extraComputations: [
        'HEALTH_RECOMMENDATIONS',
        'DOMINANT_POLLUTANT_CONCENTRATION',
        'POLLUTANT_CONCENTRATION',
        'LOCAL_AQI',
        'POLLUTANT_ADDITIONAL_INFO'
      ],
      languageCode: 'en'
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return response
}
