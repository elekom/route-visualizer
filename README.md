# route-visualizer

[link to app](https://seeyourroute.web.app)

Created to visualize routes created on [ジョルダン](https://www.jorudan.co.jp/norikae/seishun18.html)
while traveling around Japan using the [青春１８きっぷ](https://www.google.com/search?client=safari&rls=en&q=seishun+18+kippu&ie=UTF-8&oe=UTF-8)

## Basic Design
1. Parses inputted route link's HTML for stations names.
2. Looks up geocoordinates of stations using Google Places API.
3. Maps out stations using Google Maps JavaScript API.


## Prerequisites
- Docker (for development)
- Firebase
- Google Maps API

## Getting Started

### Set environment variables
```
# route-visualizer-api/functions/.env
FB_SA_TYPE=""
FB_SA_PROJECT_ID=""
FB_SA_PRIVATE_KEY_ID=""
FB_SA_PRIVATE_KEY=""
FB_SA_CLIENT_EMAIL=""
FB_SA_CLIENT_ID=""
FB_SA_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FB_SA_TOKEN_URI="https://oauth2.googleapis.com/token"
FB_SA_AUTH_PROVIDER_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
FB_SA_CLIENT_CERT_URL=""
GOOGLE_MAPS_API_KEY=""
```

```
# route-visualizer-ui/.env
REACT_APP_GOOGLE_MAPS_API_KEY=""
REACT_APP_API_URL_BASE=""
REACT_APP_FIREBASE_AUTH_DOMAIN=""
REACT_APP_FIREBASE_PROJECT_ID=""
REACT_APP_FIREBASE_STORAGE_BUCKET=""
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=""
REACT_APP_FIREBASE_APP_ID=""
```

### Run in docker containers
```
docker compose up
```

