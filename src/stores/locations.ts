import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { details, saveLocation } from '../api/location-api'
import type { LocationSession } from '@/types/global-types'
import { type Location } from '@/types/global-types'


const auth = useAuthStore();

export const useLocationStore = defineStore('location', () => {
  /* State */
  const session = reactive({ savedLocations: [] } as LocationSession)

  /* Getters */
  const getSavedLocations = computed(async () => {
    if (auth.$state.session.user) {
        const userInfo = await details();
        if (userInfo) {
            session.savedLocations = userInfo.savedLocations;
            return userInfo.savedLocations;
        }
    } 
    return [];
  })

  /* Actions */
  async function savedLocation(locationDetails: Location) {
      if (auth.$state.session.user) {
          const location = await saveLocation(locationDetails);
          if (location) {
              console.log(JSON.stringify(location));
              session.savedLocations.push(location);
          } else {
              console.error('Location Save Failed');
          }
      } 
  }

  return { session: session, getSavedLocations: getSavedLocations, savedLocation:savedLocation }
})