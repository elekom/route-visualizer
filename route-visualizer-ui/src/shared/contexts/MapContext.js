// import React, { useState, useEffect, useContext, createContext } from "react";
// const MapContext = createContext();

// // Provider component that wraps your app and makes map object ...
// // ... available to any child component that calls useMap().
// export function ProvideMap({ children }) {
//   const map = useProvideMap();
//   return <MapContext.Provider value={map}>{children}</MapContext.Provider>;
// }
// // Hook for child components to get the map object ...
// // ... and re-render when it changes.
// export const useMap = () => {
//   return useContext(MapContext);
// };
// // Provider hook that creates auth object and handles state
// function useProvideMap() {
//   const [map, setMap] = useState(null);


//   const signup = (email, password) => {
//     return createUserWithEmailAndPassword(auth, email, password)
//       .then((response) => {
//         setUser(response.user);
//         setIsLoggedIn(true);
//         return response.user;
//       });
//   };

//   const onClick = (e) => {
//     console.log(e);
//     setSelectedLocation(e);
//   }

//   const onIdle = (m) => {
//     setZoom(m.getZoom());
//     setCenter(m.getCenter().toJSON());
//   };

//   // Subscribe to map on mount
//   // Because this sets state in the callback it will cause any ...
//   // ... component that utilizes this hook to re-render with the ...
//   // ... latest map object.
//   useEffect(() => {
//     if (map) {
//       ["click", "idle"].forEach((eventName) =>
//         window.google.maps.event.clearListeners(map, eventName)
//       );

//       if (onClick) {
//         map.addListener("click", (e) => onClick(e));
//       }

//       if (onIdle) {
//         map.addListener("idle", () => onIdle(map));
//       }
//     }
//   }, [map, onIdle]);

//   useEffect(() => {
//     if (ref.current && !map) {
//       const newMap = new window.google.maps.Map(ref.current, { ...options });
//       setMap(newMap);
//     }
//   }, [ref, map, options]);

//   // Return the user object and auth methods
//   return {
//     map
//   };
// }