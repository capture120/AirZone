<script setup lang="ts">
import { ref } from 'vue'
import { type Location, AirQualityColorMap } from '@/types/global-types'

const props = defineProps<{
  location: Location
}>()

const expand = ref(false)
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
    dateTime: '2023-10-26T18:00:00Z',
    regionCode: 'us',
    indexes: [
      {
        code: 'uaqi',
        displayName: 'Universal AQI',
        aqi: 52,
        aqiDisplay: '52',
        color: {
          red: 0.9490196,
          green: 0.98039216,
          blue: 0.019607844
        },
        category: 'Moderate air quality',
        dominantPollutant: 'no2'
      }
    ]
  }
}

const pollenForecast = sampleData.pollenData.dailyInfo[0]
const airQualityForecast = sampleData.airQualityData.indexes[0]
</script>

<template>
  <v-card class="mx-auto" max-width="368" min-width="368">
    <router-link :to="'/location/' + location._id">
      <v-card-item :title="location.title.charAt(0).toUpperCase() + location.title.slice(1)">
        <template v-slot:subtitle>
          <div class="tw-flex tw-flex-row tw-content-center">
            <v-icon icon="mdi-spa" size="18" color="success"></v-icon>
            <p class="tw-ml-1">Forecast</p>
          </div>
        </template>
      </v-card-item>

      <v-card-text class="tw-py-0">
        <v-row align="center" no-gutters>
          <v-col class="text-h2" cols="6">
            {{ pollenForecast.pollenTypeInfo[0].displayName }}
          </v-col>

          <v-col cols="5" class="text-right">
            <v-icon v-if="pollenForecast.pollenTypeInfo[0].code === 'GRASS'" :color="AirQualityColorMap[pollenForecast.pollenTypeInfo[0].indexInfo.value]" icon="mdi-grass" size="88"></v-icon>
            <v-icon v-if="pollenForecast.pollenTypeInfo[0].code === 'TREE'" :color="AirQualityColorMap[pollenForecast.pollenTypeInfo[0].indexInfo.value]" icon="mdi-forest" size="88"></v-icon>
            <v-icon v-if="pollenForecast.pollenTypeInfo[0].code === 'WEED'" :color="AirQualityColorMap[pollenForecast.pollenTypeInfo[0].indexInfo.value]" icon="mdi-forest" size="88"></v-icon>
          </v-col>
        </v-row>
      </v-card-text>

      <div class="tw-flex tw-justify-between">
        <v-list-item density="compact">
          <v-list-item-subtitle>{{
            'Pollen Level: ' + pollenForecast?.pollenTypeInfo[0].indexInfo.category
          }}</v-list-item-subtitle>
        </v-list-item>

        <v-list-item density="compact" prepend-icon="mdi-weather-partly-cloudy">
          <v-list-item-subtitle>{{ airQualityForecast?.category }}</v-list-item-subtitle>
        </v-list-item>
      </div>
    </router-link>
    <v-expand-transition>
      <div v-if="expand">
        <div class="tw-flex tw-flex-auto tw-flex-row tw-justify-between"></div>
        <v-list class="bg-transparent">
          <div style="display: flex; justify-content: space-between">
            <div>
              <v-list-item
                v-for="item in sampleData.airQualityData.indexes"
                :key="item.category"
                title="Air Quality Index"
                :subtitle="item.aqi"
              >
              </v-list-item>
              <v-list-item
                v-for="item in sampleData.pollenData.dailyInfo[0].pollenTypeInfo.slice(2,4)"
                :key="item.displayName"
                :title="item.displayName + ' Pollen Index'"
                :subtitle="item.indexInfo.value"
              >
              </v-list-item>
            </div>
            <div>
              <v-list-item
                v-for="item in sampleData.pollenData.dailyInfo[0].pollenTypeInfo.slice(0,2)"
                :key="item.displayName"
                :title="item.displayName + ' Pollen Index'"
                :subtitle="item.indexInfo.value"
              >
              </v-list-item>
            </div>
          </div>
        </v-list>
      </div>
    </v-expand-transition>

    <v-divider></v-divider>
    <div class="tw-flex tw-flex-auto tw-flex-row tw-justify-between">
      <v-card-actions>
        <v-btn @click="expand = !expand">
          {{ !expand ? 'More Details' : 'Hide Details' }}
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <router-link :to="'/location/' + location._id">
          <v-btn>
            {{ !expand ? '' : 'View Map' }}
          </v-btn>
        </router-link>
      </v-card-actions>
    </div>
  </v-card>
</template>
