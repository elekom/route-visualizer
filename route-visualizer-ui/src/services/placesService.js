import axiosInstance from "../shared/axiosConfig";

/**
 * Add an array of locations (geocodes) fetched from the Google Maps Places API
 * to the database
 * @param {*} locationsToAdd array of location data as seen below
 * {
 *  locationName: '浜松駅',
 *  geocode: {
 *    lat: 000,
 *    lng: 000
 *  },
 *  place_id: 'sdlfkj124lskf'
 * }
 * @returns 204 on success or logs error
 */
export const addMultipleGeolocationsToDatabase = async (locationsToAdd) => {
  try {
    return axiosInstance.post('/geolocations/add', {locations: locationsToAdd});
  } catch (e) {
    console.error(e);
  }
}

/**
 * Sends request to Google Maps Places API to get the location information
 * Only use if the database does not already have the location stored
 * @param {*} placeName location name to query on
 * @param {*} map  Google Maps API map object
 * @returns A promise that resolves if the Places API returns results
 *      rejects if Places API returns an error
 */
export const findPlaceFromQuery = (placeName, map) => {
  return new Promise((resolve, reject) => {
    var request = {
      query: placeName,
      fields: ['ALL'],
    };

    var service = new window.google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function (results, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log(results[0]);
        resolve(results[0]);
      } else if (status === window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
        reject(status);
      }
    });
  })

}

// var request = {
//   destination: { placeId: 'ChIJC3Cf2PuLGGAROO00ukl8JwA'},
//   origin: { placeId: 'ChIJHUjien3yGGARbKdSZURvKnw'},
//   travelMode: 'TRANSIT',
//   transitOptions: {
//     departureTime: new Date('2022-05-08T13:00'),
//     modes: ['TRAIN']
//   },
// }

// var request = {
//   destination: { placeId: 'ChIJC3Cf2PuLGGAROO00ukl8JwA'},
//   origin: { placeId: 'ChIJHUjien3yGGARbKdSZURvKnw'},
//   travelMode: 'DRIVING'
// }

// var service = new window.google.maps.DirectionsService(map);
// var directionsRenderer = new window.google.maps.DirectionsRenderer();
// directionsRenderer.setMap(map);

// service.route(request, function (results, status) {
//   console.log(results);
//   if (status == 'OK') {
//     directionsRenderer.setDirections(results);
//   }
// }); 