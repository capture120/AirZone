# AirZone

## Mission
Provide a convenient tool for users to track and understand air quality data, so they can make informed and healthy decisions.

## Features

AirZone visualizes nearby air quality with heatmaps, produced using data from Google's Pollen and Air Quality API.

AirZone provides functionality to select and save heatmap views using simple geospatial calculations, allowing users to track important pollution and pollen data for their locations of interest.

For supported locations, users can track Google provided health recommendations and specific pollution metrics from various indexes.

## Implementation
    Frontend: VueJS
    Server: Express + Node
    Database: MongoDB deployed in Atlas Cloud

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Google Cloud
- Create a free Google Cloud account
- Create a new project
- Enable Google Maps, Pollen, and Pollution APIs
- Copy your API Key and add to .env file
