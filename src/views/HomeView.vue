<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLocationStore } from '@/stores/location'
import type { LocationSession } from '@/types/global-types'
import AirReportCard from '@/components/AirReportCard.vue'
const authStore = useAuthStore()
const locationStore = useLocationStore()
const user = reactive({} as LocationSession)






const sampleData = {
  pollenData: {
    regionCode: 'IL',
    dailyInfo: [
      {
        date: {
          year: 2023,
          month: 7,
          day: 15
        },
        pollenTypeInfo: [
          {
            code: 'GRASS',
            displayName: 'Grass',
            inSeason: true,
            indexInfo: {
              code: 'UPI',
              displayName: 'Universal Pollen Index',
              value: 2,
              category: 'Low',
              indexDescription:
                'People with high allergy to pollen are likely to experience symptoms',
              color: {
                red: 0.5176471,
                green: 0.8117647,
                blue: 0.2
              }
            },
            healthRecommendations: [
              "It's a good day for outdoor activities since pollen levels are low.",
              'Do you know which plants cause your pollen allergy? Check out the pollen data to be prepared.'
            ]
          },
          {
            code: 'TREE',
            displayName: 'Tree',
            inSeason: false,
            indexInfo: {
              code: 'UPI',
              displayName: 'Universal Pollen Index',
              value: 1,
              category: 'Very Low',
              indexDescription:
                'People with very high allergy to pollen are likely to experience symptoms',
              color: {
                green: 0.61960787,
                blue: 0.22745098
              }
            },
            healthRecommendations: [
              "Pollen levels are very low right now. It's a great day to enjoy the outdoors!"
            ]
          },
          {
            code: 'WEED',
            displayName: 'Weed',
            inSeason: true,
            indexInfo: {
              code: 'UPI',
              displayName: 'Universal Pollen Index',
              value: 1,
              category: 'Very Low',
              indexDescription:
                'People with very high allergy to pollen are likely to experience symptoms',
              color: {
                green: 0.61960787,
                blue: 0.22745098
              }
            },
            healthRecommendations: [
              "Pollen levels are very low right now. It's a great day to enjoy the outdoors!"
            ]
          }
        ]
      }
    ],
    nextPageToken: 'CAISdApadHlwZS5nb29nbGVhcGlzLm...'
  },
  airQualityData: {
    dateTime: '2023-06-15T10:00:00Z',
    regionCode: 'us',
    indexes: [
      {
        code: 'uaqi',
        displayName: 'Universal AQI',
        aqi: 89,
        aqiDisplay: '89',
        color: {
          red: 48,
          green: 175,
          blue: 55,
          alpha: 255
        },
        category: 'Excellent air quality',
        dominantPollutant: 'o3'
      },
      {
        code: 'usa_epa',
        displayName: 'AQI (US)',
        aqi: 41,
        aqiDisplay: '41',
        color: {
          green: 228,
          alpha: 255
        },
        category: 'Good air quality',
        dominantPollutant: 'pm25'
      }
    ],
    pollutants: [
      {
        code: 'co',
        displayName: 'CO',
        fullName: 'Carbon monoxide',
        concentration: {
          value: 334.24,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Typically originates from incomplete combustion...',
          effects: 'When inhaled, carbon monoxide can prevent the blood from...'
        }
      },
      {
        code: 'no2',
        displayName: 'NO2',
        fullName: 'Nitrogen dioxide',
        concentration: {
          value: 13.12,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Main sources are fuel burning processes, such as...',
          effects: 'Exposure may cause increased bronchial reactivity...'
        }
      },
      {
        code: 'o3',
        displayName: 'O3',
        fullName: 'Ozone',
        concentration: {
          value: 13.88,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Ozone is created in a chemical reaction between atmospheric oxygen...',
          effects: 'Ozone can irritate the airways and cause coughing, a burning...'
        }
      },
      {
        code: 'pm10',
        displayName: 'PM10',
        fullName: 'Inhalable particulate matter (<10µm)',
        concentration: {
          value: 5.07,
          units: 'MICROGRAMS_PER_CUBIC_METER'
        },
        additionalInfo: {
          sources: 'Main sources are combustion processes (e.g. indoor heating, wildfires)...',
          effects: 'Inhalable particles can penetrate into the lungs. Short term exposure...'
        }
      },
      {
        code: 'pm25',
        displayName: 'PM2.5',
        fullName: 'Fine particulate matter (<2.5µm)',
        concentration: {
          value: 2.83,
          units: 'MICROGRAMS_PER_CUBIC_METER'
        },
        additionalInfo: {
          sources: 'Main sources are combustion processes (e.g. power plants, indoor heating...',
          effects: 'Fine particles can penetrate into the lungs and bloodstream. Short term...'
        }
      },
      {
        code: 'so2',
        displayName: 'SO2',
        fullName: 'Sulfur dioxide',
        concentration: {
          value: 0.02,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Main sources are burning processes of sulfur-containing fuel in industry...',
          effects: 'Exposure causes irritation of the respiratory tract, coughing and generates...'
        }
      }
    ],
    healthRecommendations: {
      generalPopulation:
        'With this level of air quality, you have no limitations. Enjoy the outdoors!',
      elderly:
        'If you start to feel respiratory discomfort such as coughing or breathing difficulties...',
      lungDiseasePopulation: '...',
      heartDiseasePopulation: '...',
      athletes: '...',
      pregnantWomen: '...',
      children: '...'
    }
  }
}

const sampleDataModerate = {
  pollenData: {
    regionCode: 'IL',
    dailyInfo: [
      {
        date: {
          year: 2023,
          month: 7,
          day: 15
        },
        pollenTypeInfo: [
          {
            code: 'TREE',
            displayName: 'Tree',
            inSeason: true,
            indexInfo: {
              code: 'UPI',
              displayName: 'Universal Pollen Index',
              value: 3,
              category: 'Moderate',
              indexDescription:
                'People with allergies to pollen are likely to experience symptoms',
              color: {
                red: 0.5176471,
                green: 0.8117647,
                blue: 0.2
              }
            },
            healthRecommendations: [
              "People with allergies to pollen are likely to experience symptoms",
            ]
          },
          {
            code: 'GRASS',
            displayName: 'Grass',
            inSeason: false,
            indexInfo: {
              code: 'UPI',
              displayName: 'Universal Pollen Index',
              value: 1,
              category: 'Very Low',
              indexDescription:
                'People with very high allergy to pollen are likely to experience symptoms',
              color: {
                green: 0.61960787,
                blue: 0.22745098
              }
            },
            healthRecommendations: [
              "Pollen levels are very low right now. It's a great day to enjoy the outdoors!"
            ]
          },
          {
            code: 'WEED',
            displayName: 'Weed',
            inSeason: true,
            indexInfo: {
              code: 'UPI',
              displayName: 'Universal Pollen Index',
              value: 1,
              category: 'Very Low',
              indexDescription:
                'People with very high allergy to pollen are likely to experience symptoms',
              color: {
                green: 0.61960787,
                blue: 0.22745098
              }
            },
            healthRecommendations: [
              "Pollen levels are very low right now. It's a great day to enjoy the outdoors!"
            ]
          }
        ]
      }
    ],
    nextPageToken: 'CAISdApadHlwZS5nb29nbGVhcGlzLm...'
  },
  airQualityData: {
    dateTime: '2023-06-15T10:00:00Z',
    regionCode: 'us',
    indexes: [
      {
        code: 'uaqi',
        displayName: 'Universal AQI',
        aqi: 89,
        aqiDisplay: '89',
        color: {
          red: 48,
          green: 175,
          blue: 55,
          alpha: 255
        },
        category: 'Excellent air quality',
        dominantPollutant: 'o3'
      },
      {
        code: 'usa_epa',
        displayName: 'AQI (US)',
        aqi: 41,
        aqiDisplay: '41',
        color: {
          green: 228,
          alpha: 255
        },
        category: 'Good air quality',
        dominantPollutant: 'pm25'
      }
    ],
    pollutants: [
      {
        code: 'co',
        displayName: 'CO',
        fullName: 'Carbon monoxide',
        concentration: {
          value: 334.24,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Typically originates from incomplete combustion...',
          effects: 'When inhaled, carbon monoxide can prevent the blood from...'
        }
      },
      {
        code: 'no2',
        displayName: 'NO2',
        fullName: 'Nitrogen dioxide',
        concentration: {
          value: 13.12,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Main sources are fuel burning processes, such as...',
          effects: 'Exposure may cause increased bronchial reactivity...'
        }
      },
      {
        code: 'o3',
        displayName: 'O3',
        fullName: 'Ozone',
        concentration: {
          value: 13.88,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Ozone is created in a chemical reaction between atmospheric oxygen...',
          effects: 'Ozone can irritate the airways and cause coughing, a burning...'
        }
      },
      {
        code: 'pm10',
        displayName: 'PM10',
        fullName: 'Inhalable particulate matter (<10µm)',
        concentration: {
          value: 5.07,
          units: 'MICROGRAMS_PER_CUBIC_METER'
        },
        additionalInfo: {
          sources: 'Main sources are combustion processes (e.g. indoor heating, wildfires)...',
          effects: 'Inhalable particles can penetrate into the lungs. Short term exposure...'
        }
      },
      {
        code: 'pm25',
        displayName: 'PM2.5',
        fullName: 'Fine particulate matter (<2.5µm)',
        concentration: {
          value: 2.83,
          units: 'MICROGRAMS_PER_CUBIC_METER'
        },
        additionalInfo: {
          sources: 'Main sources are combustion processes (e.g. power plants, indoor heating...',
          effects: 'Fine particles can penetrate into the lungs and bloodstream. Short term...'
        }
      },
      {
        code: 'so2',
        displayName: 'SO2',
        fullName: 'Sulfur dioxide',
        concentration: {
          value: 0.02,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Main sources are burning processes of sulfur-containing fuel in industry...',
          effects: 'Exposure causes irritation of the respiratory tract, coughing and generates...'
        }
      }
    ],
    healthRecommendations: {
      generalPopulation:
        'With this level of air quality, you have no limitations. Enjoy the outdoors!',
      elderly:
        'If you start to feel respiratory discomfort such as coughing or breathing difficulties...',
      lungDiseasePopulation: '...',
      heartDiseasePopulation: '...',
      athletes: '...',
      pregnantWomen: '...',
      children: '...'
    }
  }
}

const sampleDataHigh = {
  pollenData: {
    regionCode: 'IL',
    dailyInfo: [
      {
        date: {
          year: 2023,
          month: 7,
          day: 15
        },
        pollenTypeInfo: [
          {
            code: 'TREE',
            displayName: 'Tree',
            inSeason: true,
            indexInfo: {
              code: 'UPI',
              displayName: 'Universal Pollen Index',
              value: 4,
              category: 'High',
              indexDescription:
                'People with allergies to pollen are likely to experience symptoms',
              color: {
                red: 0.5176471,
                green: 0.8117647,
                blue: 0.2
              }
            },
            healthRecommendations: [
              "People with allergies to pollen are likely to experience symptoms",
            ]
          },
          {
            code: 'GRASS',
            displayName: 'Grass',
            inSeason: false,
            indexInfo: {
              code: 'UPI',
              displayName: 'Universal Pollen Index',
              value: 1,
              category: 'Very Low',
              indexDescription:
                'People with very high allergy to pollen are likely to experience symptoms',
              color: {
                green: 0.61960787,
                blue: 0.22745098
              }
            },
            healthRecommendations: [
              "Pollen levels are very low right now. It's a great day to enjoy the outdoors!"
            ]
          },
          {
            code: 'WEED',
            displayName: 'Weed',
            inSeason: true,
            indexInfo: {
              code: 'UPI',
              displayName: 'Universal Pollen Index',
              value: 1,
              category: 'Very Low',
              indexDescription:
                'People with very high allergy to pollen are likely to experience symptoms',
              color: {
                green: 0.61960787,
                blue: 0.22745098
              }
            },
            healthRecommendations: [
              "Pollen levels are very low right now. It's a great day to enjoy the outdoors!"
            ]
          }
        ]
      }
    ],
    nextPageToken: 'CAISdApadHlwZS5nb29nbGVhcGlzLm...'
  },
  airQualityData: {
    dateTime: '2023-06-15T10:00:00Z',
    regionCode: 'us',
    indexes: [
      {
        code: 'uaqi',
        displayName: 'Universal AQI',
        aqi: 89,
        aqiDisplay: '89',
        color: {
          red: 48,
          green: 175,
          blue: 55,
          alpha: 255
        },
        category: 'Excellent air quality',
        dominantPollutant: 'o3'
      },
      {
        code: 'usa_epa',
        displayName: 'AQI (US)',
        aqi: 41,
        aqiDisplay: '41',
        color: {
          green: 228,
          alpha: 255
        },
        category: 'Good air quality',
        dominantPollutant: 'pm25'
      }
    ],
    pollutants: [
      {
        code: 'co',
        displayName: 'CO',
        fullName: 'Carbon monoxide',
        concentration: {
          value: 334.24,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Typically originates from incomplete combustion...',
          effects: 'When inhaled, carbon monoxide can prevent the blood from...'
        }
      },
      {
        code: 'no2',
        displayName: 'NO2',
        fullName: 'Nitrogen dioxide',
        concentration: {
          value: 13.12,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Main sources are fuel burning processes, such as...',
          effects: 'Exposure may cause increased bronchial reactivity...'
        }
      },
      {
        code: 'o3',
        displayName: 'O3',
        fullName: 'Ozone',
        concentration: {
          value: 13.88,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Ozone is created in a chemical reaction between atmospheric oxygen...',
          effects: 'Ozone can irritate the airways and cause coughing, a burning...'
        }
      },
      {
        code: 'pm10',
        displayName: 'PM10',
        fullName: 'Inhalable particulate matter (<10µm)',
        concentration: {
          value: 5.07,
          units: 'MICROGRAMS_PER_CUBIC_METER'
        },
        additionalInfo: {
          sources: 'Main sources are combustion processes (e.g. indoor heating, wildfires)...',
          effects: 'Inhalable particles can penetrate into the lungs. Short term exposure...'
        }
      },
      {
        code: 'pm25',
        displayName: 'PM2.5',
        fullName: 'Fine particulate matter (<2.5µm)',
        concentration: {
          value: 2.83,
          units: 'MICROGRAMS_PER_CUBIC_METER'
        },
        additionalInfo: {
          sources: 'Main sources are combustion processes (e.g. power plants, indoor heating...',
          effects: 'Fine particles can penetrate into the lungs and bloodstream. Short term...'
        }
      },
      {
        code: 'so2',
        displayName: 'SO2',
        fullName: 'Sulfur dioxide',
        concentration: {
          value: 0.02,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Main sources are burning processes of sulfur-containing fuel in industry...',
          effects: 'Exposure causes irritation of the respiratory tract, coughing and generates...'
        }
      }
    ],
    healthRecommendations: {
      generalPopulation:
        'With this level of air quality, you have no limitations. Enjoy the outdoors!',
      elderly:
        'If you start to feel respiratory discomfort such as coughing or breathing difficulties...',
      lungDiseasePopulation: '...',
      heartDiseasePopulation: '...',
      athletes: '...',
      pregnantWomen: '...',
      children: '...'
    }
  }
}
const sampleDataVeryHigh = {
  pollenData: {
    regionCode: 'IL',
    dailyInfo: [
      {
        date: {
          year: 2023,
          month: 7,
          day: 15
        },
        pollenTypeInfo: [
          {
            code: 'GRASS',
            displayName: 'Grass',
            inSeason: true,
            indexInfo: {
              code: 'UPI',
              displayName: 'Universal Pollen Index',
              value: 5,
              category: 'Very High',
              indexDescription:
                'People with allergies to pollen are likely to experience symptoms',
              color: {
                red: 0.5176471,
                green: 0.8117647,
                blue: 0.2
              }
            },
            healthRecommendations: [
              "Pollen Levels are extremely high, stay indoors if possible",
            ]
          },
          {
            code: 'GRASS',
            displayName: 'Grass',
            inSeason: false,
            indexInfo: {
              code: 'UPI',
              displayName: 'Universal Pollen Index',
              value: 1,
              category: 'Very Low',
              indexDescription:
                'People with very high allergy to pollen are likely to experience symptoms',
              color: {
                green: 0.61960787,
                blue: 0.22745098
              }
            },
            healthRecommendations: [
              "Pollen levels are very low right now. It's a great day to enjoy the outdoors!"
            ]
          },
          {
            code: 'TREE',
            displayName: 'Tree',
            inSeason: true,
            indexInfo: {
              code: 'UPI',
              displayName: 'Universal Pollen Index',
              value: 1,
              category: 'Very Low',
              indexDescription:
                'People with very high allergy to pollen are likely to experience symptoms',
              color: {
                green: 0.61960787,
                blue: 0.22745098
              }
            },
            healthRecommendations: [
              "Pollen levels are very low right now. It's a great day to enjoy the outdoors!"
            ]
          }
        ]
      }
    ],
    nextPageToken: 'CAISdApadHlwZS5nb29nbGVhcGlzLm...'
  },
  airQualityData: {
    dateTime: '2023-06-15T10:00:00Z',
    regionCode: 'us',
    indexes: [
      {
        code: 'uaqi',
        displayName: 'Universal AQI',
        aqi: 89,
        aqiDisplay: '89',
        color: {
          red: 48,
          green: 175,
          blue: 55,
          alpha: 255
        },
        category: 'Excellent air quality',
        dominantPollutant: 'o3'
      },
      {
        code: 'usa_epa',
        displayName: 'AQI (US)',
        aqi: 41,
        aqiDisplay: '41',
        color: {
          green: 228,
          alpha: 255
        },
        category: 'Good air quality',
        dominantPollutant: 'pm25'
      }
    ],
    pollutants: [
      {
        code: 'co',
        displayName: 'CO',
        fullName: 'Carbon monoxide',
        concentration: {
          value: 334.24,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Typically originates from incomplete combustion...',
          effects: 'When inhaled, carbon monoxide can prevent the blood from...'
        }
      },
      {
        code: 'no2',
        displayName: 'NO2',
        fullName: 'Nitrogen dioxide',
        concentration: {
          value: 13.12,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Main sources are fuel burning processes, such as...',
          effects: 'Exposure may cause increased bronchial reactivity...'
        }
      },
      {
        code: 'o3',
        displayName: 'O3',
        fullName: 'Ozone',
        concentration: {
          value: 13.88,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Ozone is created in a chemical reaction between atmospheric oxygen...',
          effects: 'Ozone can irritate the airways and cause coughing, a burning...'
        }
      },
      {
        code: 'pm10',
        displayName: 'PM10',
        fullName: 'Inhalable particulate matter (<10µm)',
        concentration: {
          value: 5.07,
          units: 'MICROGRAMS_PER_CUBIC_METER'
        },
        additionalInfo: {
          sources: 'Main sources are combustion processes (e.g. indoor heating, wildfires)...',
          effects: 'Inhalable particles can penetrate into the lungs. Short term exposure...'
        }
      },
      {
        code: 'pm25',
        displayName: 'PM2.5',
        fullName: 'Fine particulate matter (<2.5µm)',
        concentration: {
          value: 2.83,
          units: 'MICROGRAMS_PER_CUBIC_METER'
        },
        additionalInfo: {
          sources: 'Main sources are combustion processes (e.g. power plants, indoor heating...',
          effects: 'Fine particles can penetrate into the lungs and bloodstream. Short term...'
        }
      },
      {
        code: 'so2',
        displayName: 'SO2',
        fullName: 'Sulfur dioxide',
        concentration: {
          value: 0.02,
          units: 'PARTS_PER_BILLION'
        },
        additionalInfo: {
          sources: 'Main sources are burning processes of sulfur-containing fuel in industry...',
          effects: 'Exposure causes irritation of the respiratory tract, coughing and generates...'
        }
      }
    ],
    healthRecommendations: {
      generalPopulation:
        'With this level of air quality, you have no limitations. Enjoy the outdoors!',
      elderly:
        'If you start to feel respiratory discomfort such as coughing or breathing difficulties...',
      lungDiseasePopulation: '...',
      heartDiseasePopulation: '...',
      athletes: '...',
      pregnantWomen: '...',
      children: '...'
    }
  }
}

const sampleDataList = [sampleData, sampleDataModerate, sampleDataHigh, sampleDataVeryHigh]

onMounted(async () => {
  if (authStore.$state.session.user) {
    await locationStore.updateLatestLocations()
    user.savedLocations = locationStore.getSavedLocations
  }
})
</script>

<template>
  <div class="tw-max-w-80%">
    <v-container class="tw-rounded-lg">
      <div class="tw-flex tw-justify-center">
        <h1 class="tw-text-4xl tw-font-bold tw-font-serif tw-m-6">Locations</h1>
      </div>
      <VRow
        v-if="authStore.$state.session.user"
        class="d-flex align-center justify-space-evenly"
        rounded
        rounded-circle
      >
        <VCol
          v-for="location in user.savedLocations"
          v-bind:key="location._id"
          class="tw-my-6"
          cols="4"
          md="4"
          sm="6"
          xs="12"
        >
            <AirReportCard :location="location" :sampleData="sampleDataList[Math.floor(Math.random() * sampleDataList.length)]"/>
        </VCol>
      </VRow>
    </v-container>
  </div>
</template>
@/stores/location
