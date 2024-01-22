import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { details, saveLocation, removeLocation } from '../api/location-api'
import type { LocationSession } from '@/types/global-types'
import { type Location } from '@/types/global-types'
import { findLocationById } from '../api/location-api'

const auth = useAuthStore();
export const useLocationStore = defineStore('location', () => {
  /* State */
  const session = reactive({ savedLocations: [] } as LocationSession)

  /* Getters */
  const getSavedLocations = computed(() => {
    if (auth.$state.session.user) {
      return session.savedLocations;
    } 
    return [];
  })
  
  /* Actions */
  
  async function getLocationById(id: string): Promise<Location | null> {
    if (auth.$state.session.user) {
      const savedLocation = await findLocationById(id);
      if (savedLocation !== undefined) {
        return savedLocation;
      }
    } 
    return null;
  }

  async function savedLocation(locationDetails: Location) {
      if (auth.$state.session.user) {
          const location = await saveLocation(locationDetails);
          if (location) {
              session.savedLocations.push(location);
          } else {
              console.error('Location Save Failed');
          }
      } 
  }

  /* Gets the most up-to-date locations the user has saved */
  async function updateLatestLocations() {
    if (auth.$state.session.user) {
      const userInfo = await details();
      if (userInfo) {
          session.savedLocations = userInfo.savedLocations;
      }
    } 
  }

  async function deleteLocation(locationId: string) {
    if (auth.$state.session.user) {
      const userInfo = await removeLocation(locationId);
      if (userInfo) {
          session.savedLocations = userInfo.savedLocations;
      }
    } 
  }

  return { session: session, getSavedLocations: getSavedLocations, getLocationById: getLocationById, savedLocation:savedLocation, updateLatestLocations: updateLatestLocations, deleteLocation: deleteLocation }
})