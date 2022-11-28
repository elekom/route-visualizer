import React, { useEffect, useRef, useState } from 'react';
import { findPlaceFromQuery } from '../../services/placesService';
import Button from '../Button';

export default function Map({
  onClick,
  children,
  routeData,
  createMarkerFromPlace,
  addRetryingLocation,
  addFetchedLocation,
  ...options
}) {

  const ref = useRef(null);
  const [map, setMap] = useState();
  const [isInitialCenterSet, setIsInitialCenterSet] = useState(false);

  const RETRY_COUNT = 20;
  const RETRY_DELAY = 10000; // milliseconds

  const defaultCenter = {
    lat: 35.6762,
    lng: 139.6503
  }

  /**
   * Center the Google Maps API map object on the user's current location
   * from the browser
   */
  function centerOnCurrentLocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
        },
        () => {
          map.setCenter(defaultCenter);
        }
      );
    } else {
      // Browser doesn't support Geolocation
      map.setCenter(defaultCenter);
    }
  }

  /**
   * Checks if a location object has geolocation included
   * @param {*} routeSegmentLocation location object
   * @returns boolean
   */
  function containsGeolocation(routeSegmentLocation) {
    return routeSegmentLocation.geocode !== undefined;
  }

  /**
   * Handles either using the geolocation data in the server response to create markers
   * or making requests to the Google Maps API to get location data
   * @param {*} location location object
   * @param {*} isMajorMarker to / from stations are true, in between stations are false
   *  (changes marker appearance)
   * @param {*} map Google Maps API map object
   */
  function getLocationData(location, isMajorMarker, map) {
    if (containsGeolocation(location)) {
      createMarkerFromPlace(location.place_id, location.geocode, isMajorMarker, location.locationName, location.waitTime);
    } else {
      addRetryingLocation(location.locationName);
      retryOperation(findPlaceFromQuery, RETRY_DELAY, RETRY_COUNT, new Array(location.locationName, map, isMajorMarker, location.waitTime));
    }
  }

  /**
   * Creates delay for secified amount of ms
   * @param {*} ms delay duration in milliseconds 
   * @returns Promise that resolves once delay is over
   */
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /**
   * Handles retry operation of fetching location information from Places API
   * Necessary because there is an API limit to 10 requests / 10 seconds
   * Keeps retrying until success or retry limit is met
   * @param {*} operation method to keep retrying
   * @param {*} delay amount of delay between retries in ms
   * @param {*} retries max number of retries before failing
   * @param {*} args arguments to pass into operation
   * @returns Promise that resolves once retry succeeds or rejects if retry fails
   */
  const retryOperation = (operation, delay, retries, args) => new Promise((resolve, reject) => {
    return operation(args[0], args[1])
      .then((place) => {
        createMarkerFromPlace(place.place_id, place.geometry.location, args[2], args[3]);

        // ADD LOCATION TO COLLECTION TO BE ADDED TO DB
        addFetchedLocation({
          locationName: args[0],
          geocode: place.geometry.location,
          place_id: place.place_id
        });
        console.log('retry succeeded');
        resolve();
      })
      .catch((reason) => {
        if (retries > 0) {
          console.log('retry failed');
          return wait(delay)
            .then(retryOperation.bind(null, operation, delay, retries - 1, args))
            .then(resolve)
            .catch(reject);
        }
        return reject(reason);
      });
  });

  /**
   * Initializes Google Maps API map object with passed in options
   */
  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, { ...options });
      setMap(newMap);
    }
  }, [ref, map, options]);

  /**
   * Sets up listeners on map object
   */
  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        window.google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", (e) => onClick(e));
      }
    }
  }, [map]);

  /**
   * Cets initial center of map object to the current location of the user
   */
  useEffect(() => {
    if (map && !isInitialCenterSet) {
      centerOnCurrentLocation();
      setIsInitialCenterSet(true);
    }
  }, [map]);

  /**
   * Updates the center of the map if the props center changes
   */
  useEffect(() => {
    if (map && options.center) {
      map.setCenter(options.center);
    }
  }, [options.center]);

  /**
   * Updates the zoom of the map if the props zoom changes
   */
  useEffect(() => {
    if (map && options.zoom) {
      map.setZoom(options.zoom);
    }
  }, [options.zoom]);

  /**
   * Handles calling methods to create markers once route data has been populated in parent component
   */
  useEffect(() => {
    if (map && routeData) {
      const findPlaces = async () => {
        routeData.map((routeSegment, i) => {
          // FIRST STATION
          if (routeSegment.segmentNumber === 0) {
            const fromLocation = routeSegment.from;
            // IF API DATA CONTAINS LOCATION GEOCODE, USE IT TO CREATE THE MARKER
            // ELSE USE GOOGLE MAPS PLACES API TO FIND THE LOCATION AND STORE IN DB
            getLocationData(fromLocation, true, map);
          }

          // TO STATIONS
          const toLocation = routeSegment.to;
          getLocationData(toLocation, true, map);

          // IN BETWEEN STATIONS
          routeSegment.stationsBetween?.map((station) => {
            getLocationData(station, false, map);
          });
          
        });
      };
      findPlaces();
    }
  }, [routeData]);

  return (
    <div>
      <div className='map' ref={ref} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
      <Button className='u-bottom-right-position-2' onClick={centerOnCurrentLocation} title='Center on Current Location'>
        <i className='icon-basic-geolocalize-01'></i>
      </Button>
    </div>
  )
}
