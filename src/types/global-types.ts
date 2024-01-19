export interface User {
    username: String,
    password: String | null,
    savedLocations: Array<Location>
}

export interface Location {
    lat: Number
    lng: Number
    title: String
}