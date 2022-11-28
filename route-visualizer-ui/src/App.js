import Overlay from './components/Overlay';
import './sass/main.scss';
import { ProvideAuth } from './shared/contexts/AuthContext';
import { app } from './firebaseConfig';
import { Wrapper } from "@googlemaps/react-wrapper";
import Map from './components/maps/Map';
import { useEffect, useState } from 'react';
import Marker from './components/maps/Marker';
import { getLocationsForAllTags } from './services/filtersService';
import { assign, filter, flatten } from 'lodash';
import { getRouteData } from './services/routesService';
import Loader from './components/overlays/Loader';
import { addMultipleGeolocationsToDatabase } from './services/placesService';

function App() {

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const [locations, setLocations] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [placeMarkers, setPlaceMarkers] = useState([]);
  const [zoom, setZoom] = useState(15); // initial zoom
  const [center, setCenter] = useState(null);
  const [routeData, setRouteData] = useState();
  const [routeTitle, setRouteTitle] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlayButtons, setShowOverlayButtons] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [retryingLocations, setRetryingLocations] = useState([]);
  const [fetchedLocations, setFetchedLocations] = useState([]);

  const [isRouteCentered, setIsRouteCentered] = useState(false);

  const render = (status) => {
    return <h1>{status}</h1>;
  };


  /**
   * Creates markers for ROUTE DATA (stations)
   * @param {*} place_id Google Maps placeId
   * @param {*} geocode lat and long of location in an object
   * @param {*} isMajorMarker to / from stations are true, in between are false
   * @param {*} locationName name of location to be placed in info window
   * @param {*} waitTime OPTIONAL wait time at stations
   */
  const createMarkerFromPlace = (place_id, geocode, isMajorMarker, locationName, waitTime) => {
    setPlaceMarkers(prev => [...prev,
    <Marker key={place_id} position={geocode} locationName={locationName} placeId={place_id}
      waitTime={waitTime}
      icon={{
        path: isMajorMarker ? window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW
          : window.google.maps.SymbolPath.CIRCLE,
        strokeColor: '#ff0000',
        scale: isMajorMarker ? 4 : 2
    }} 
    />
    ]);

    if (!isRouteCentered) {
      setCenter(geocode);
      setIsRouteCentered(true);
    }
  }

    /**
   * [
   *    {
   *      tagId: tag-id-1
   *      markers: [
   *        Marker1,
   *        Marker2
   *      ]
   *    },...  
   * ]
   */
  const createMarkers = (fetchedTags) => {
    fetchedTags.map((tag) => {
      var tagMarkers = [];
      if (tag.locations.length > 0) {
        setCenter(tag.locations[0]);
        tag.locations.map((location, i) => (
          tagMarkers = [...tagMarkers,
          <Marker key={tag.tagId + "-" + i.toString()} position={location} icon={{
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor: tag.color,
            scale: 4
          }} />
          ]
        ));
        var markerObject = { tagId: tag.tagId, markers: tagMarkers };
        setMarkers([...markers, markerObject]);
      }
    });
  }

  const removeMarkers = (tagToRemove) => {
    setMarkers(filter(markers, (marker) => marker.tagId === tagToRemove));
  }

  /**
   * On click handler to be passed to Google Maps API map object
   * @param {*} e click event
   */
  const onClick = (e) => {
    // console.log(e);
    // setSelectedLocation(e);
  }

  /**
   * Generates random color in hex
   * @returns hex value of a color
   */
  const generateRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  /**
   * Takes JORUDAN URL and sends request to server for route data
   * @param {*} routeUrl JORUDAN URL of route to be mapped out
   */
  const populateRouteData = (request) => {
    setIsLoading(true);
    setShowOverlayButtons(false);
    const fetchRouteData = async () => {
      const fetchedRoute = await getRouteData(request);
      console.log('fetchedRoute', fetchedRoute);
      displayRoute(fetchedRoute);
    }
    fetchRouteData();
  }

  /**
   * Takes route data and sets it up to be displayed on map
   * Used when new route is fetched and also passed to child component to display a saved route
   * @param {*} routeData route to display on map
   */
  const displayRoute = (routeData) => {
    setPlaceMarkers([]);
    setRouteData(routeData);
    setIsLoading(false);
    setShowOverlayButtons(true);
    setZoom(7);
  }

  /**
   * Adds location name that is being fetched from Google Maps API
   * Also sets loading to true again
   * @param {*} locationName name of location to be added
   */
  const addRetryingLocation = (locationName) => {
    setIsLoading(true);
    setRetryingLocations(prev => [...prev, locationName]);
  }

  /**
   * Adds location object that has been fetched from Google Maps API
   * @param {*} location location object to be added
   */
  const addFetchedLocation = (location) => {
    setFetchedLocations(prev => [...prev, location]);
  }

  /**
   * Updates the loading message of the loader based on whether locations are being fetched from Google Maps API
   */
  useEffect(() => {
    (retryingLocations.length === 0) ? setLoadingMessage('Loading...') : 
      setLoadingMessage(`Fetching ${retryingLocations.length} locations from Google...This will take a while...`);
  }, [retryingLocations]);

  /**
   * Listens for updates to fetchedLocations
   * When size of fetchedLocations matches retryingLocations, all locations have been fetched
   * Sets loading to false and sends request to server with all fetched locations
   */
  useEffect(() => {
    if (retryingLocations.length > 0 && retryingLocations.length - fetchedLocations.length <= 1 && isLoading) {
      setIsLoading(false);
      addMultipleGeolocationsToDatabase(fetchedLocations);
      console.log('send locations to be added to DB');
      setFetchedLocations([]);
      setRetryingLocations([]);
    }
  }, [fetchedLocations]);

  /**
   * Listens for updates to selectedFilters
   * If any filters are selected, sends a request to the server to get the locations saved for those filters
   * and creates markers
   */
  useEffect(() => {
    if (selectedFilters.length > 0) {
      const fetchLocations = async () => {
        const fetchedTags = await getLocationsForAllTags(selectedFilters.map((filter) => filter.id));
        createMarkers(fetchedTags.map((tagInfo) => assign(tagInfo, { color: generateRandomColor() })));
      }
      fetchLocations();
    }
  }, [selectedFilters]);

  return (
    <ProvideAuth>
      <Wrapper
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        render={render}
        libraries={["places", "directions"]}
      >
        <Map
          center={center}
          zoom={zoom}
          onClick={onClick}
          routeData={routeData?.routeSegments}
          createMarkerFromPlace={createMarkerFromPlace}
          setIsLoading={setIsLoading}
          addRetryingLocation={addRetryingLocation}
          addFetchedLocation={addFetchedLocation}
        >
          {flatten(markers.map((tag) => tag.markers))}
          {placeMarkers}
        </Map>
      </Wrapper>
      {showOverlayButtons &&
        <Overlay
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          removeMarkers={removeMarkers}
          selectedLocation={selectedLocation}
          populateRouteData={populateRouteData}
          routeData={routeData}
          displayRoute={displayRoute}
        />
      }
      {isLoading && <Loader loadingMessage={loadingMessage} />}
    </ProvideAuth>
  );
}

export default App;
