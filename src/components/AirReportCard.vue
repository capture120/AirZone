<script setup lang="ts">
import { ref } from 'vue'
import { type Location, AirQualityColorMap } from '@/types/global-types'

const props = defineProps<{
  location: Location
  sampleData: any
}>()

console.log(JSON.stringify(props.sampleData))

const expand = ref(false)

const pollenForecast = props.sampleData.pollenData.dailyInfo[0]
const airQualityForecast = props.sampleData.airQualityData.indexes[0]
</script>

<template>
  <v-card class="mx-auto" max-width="368" min-width="368">
    <router-link :to="'/location/' + location._id">
      <v-card-item :title="location.title.charAt(0).toUpperCase() + location.title.slice(1)">
        <template v-slot:subtitle>
          <div class="tw-flex tw-flex-row tw-content-center">
            <v-icon icon="mdi-spa" size="18" :color="AirQualityColorMap[pollenForecast.pollenTypeInfo[0].indexInfo.value]"></v-icon>
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
            <v-icon
              v-if="pollenForecast.pollenTypeInfo[0].code === 'GRASS'"
              :color="AirQualityColorMap[pollenForecast.pollenTypeInfo[0].indexInfo.value]"
              icon="mdi-grass"
              size="88"
            ></v-icon>
            <v-icon
              v-if="pollenForecast.pollenTypeInfo[0].code === 'TREE'"
              :color="AirQualityColorMap[pollenForecast.pollenTypeInfo[0].indexInfo.value]"
              icon="mdi-forest"
              size="88"
            ></v-icon>
            <v-icon
              v-if="pollenForecast.pollenTypeInfo[0].code === 'WEED'"
              :color="AirQualityColorMap[pollenForecast.pollenTypeInfo[0].indexInfo.value]"
              icon="mdi-forest"
              size="88"
            ></v-icon>
          </v-col>
        </v-row>
      </v-card-text>

      <div class="tw-flex tw-justify-between">
        <v-list-item density="compact">
          <v-list-item-subtitle>{{
            'Pollen: ' + pollenForecast?.pollenTypeInfo[0].indexInfo.category
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
                v-for="item in sampleData.airQualityData.indexes.slice(0,1)"
                :key="item.category"
                title="Air Quality Index"
                :subtitle="item.aqi"
              >
              </v-list-item>
              <v-list-item
                v-for="item in sampleData.pollenData.dailyInfo[0].pollenTypeInfo.slice(2, 4)"
                :key="item.displayName"
                :title="item.displayName + ' Pollen Index'"
                :subtitle="item.indexInfo.value"
              >
              </v-list-item>
            </div>
            <div>
              <v-list-item
                v-for="item in sampleData.pollenData.dailyInfo[0].pollenTypeInfo.slice(0, 2)"
                :key="item.displayName"
                :title="item.displayName + ' Pollen Index'"
                :subtitle="item.indexInfo.value"
              >
              </v-list-item>
            </div>
          </div>
          <v-card-text class="tw-mb-0">
            <div class="tw-flex tw-flex-col">
              <div>
                <div class="tw-flex tw-justify-center">
                  <v-card-subtitle>Pollen Recommendations:</v-card-subtitle>
                </div>
                <v-card-text class="text-center">
                  {{
                    sampleData.pollenData.dailyInfo[0].pollenTypeInfo[0].healthRecommendations[0]
                  }}
                </v-card-text>
              </div>
              <div>
                <div class="tw-flex tw-justify-center">
                  <v-card-subtitle>Air Quality Recommendations:</v-card-subtitle>
                </div>
                <v-card-text class="text-center">
                  {{ sampleData.airQualityData.healthRecommendations.generalPopulation }}
                </v-card-text>
              </div>
            </div>
          </v-card-text>
        </v-list>
      </div>
    </v-expand-transition>

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
