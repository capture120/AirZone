export interface UserSession {
  user: User | null
  csrfToken: string | null
}

export interface User {
  username: string
  password: string | null
  savedLocations: Array<Location>
}

export interface LocationSession {
  savedLocations: Location[]
}

export interface Location {
  _id: string
  lat: number
  lng: number
  zoom: number
  title: string
  boundNorth: number
  boundSouth: number
  boundWest: number
  boundEast: number
  heatmapGridSizeX: number
  heatmapGridSizeY: number
}

export type SelectionBoundary = {
  north: number
  south: number
  east: number
  west: number
}

export type LocationStat = {
  locationId: string
  pollenData: any
  airQualityData: any
}

export const AirQualityColorMap = [
  '',
  'green',
  'light-green',
  'yellow',
  'orange',
  'red',
];
