import { useEffect, useState } from 'react'

export default function Marker(props) {

  const [marker, setMarker] = useState();
  const [infoWindow, setInfoWindow] = useState();

  const GOOGLE_MAPS_LINK_BASE = 'https://www.google.com/maps/search/?api=1'

  useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(props);

      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map: props.map,
          shouldFocus: false,
          content: 'Hello'
        });
      });
    }
  }, [marker, props]);

  useEffect(() => {
    if (!infoWindow && props.placeId) {
      //console.log(props)
      var content;
      if (props.waitTime) {
        content = `<div class='map__info-window'>
          <div>${props.locationName}</div>
          <div>${props.waitTime}</div>
          <a target='blank' href='${GOOGLE_MAPS_LINK_BASE}&query=${props.position.lat}%2C${props.position.lng}3&query_place_id=${props.placeId}'>View on Google Maps</a>
        </div>`;
      } else {
        content = `<div class='map__info-window'>
          <div>${props.locationName}</div>
          <a target='blank' href='${GOOGLE_MAPS_LINK_BASE}&query=${props.position.lat}%2C${props.position.lng}3&query_place_id=${props.placeId}'>View on Google Maps</a>
        </div>`;
      }

      setInfoWindow(new window.google.maps.InfoWindow({
        content: content
      }));
    }

    // remove info window from map on unmount
    return () => {
      if (infoWindow) {
        infoWindow.setMap(null);
      }
    };
  }, [infoWindow]);

  return null;
}
