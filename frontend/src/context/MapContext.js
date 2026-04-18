import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MapContext as GoogleMapsMapContext } from '@react-google-maps/api';

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const mapInstanceRef = useRef(null);

  // Set map instance from Google Maps context
  const setMapInstance = (mapInstance) => {
    setMap(mapInstance);
    mapInstanceRef.current = mapInstance;
  };

  // Set markers (for trip start/end points, current location, etc.)
  const setMapMarkers = (newMarkers) => {
    setMarkers(newMarkers);
  };

  // Set routes (for displaying trip paths)
  const setMapRoutes = (newRoutes) => {
    setRoutes(newRoutes);
  };

  // Set current location (from GPS or user input)
  const setUserCurrentLocation = (location) => {
    setCurrentLocation(location);
  };

  // Set destination (for trip planning)
  const setUserDestination = (dest) => {
    setDestination(dest);
  };

  // Clear all map data
  const clearMapData = () => {
    setMarkers([]);
    setRoutes([]);
    setCurrentLocation(null);
    setDestination(null);
  };

  // Update our map state when the Google Maps instance is ready
  useEffect(() => {
    if (mapInstanceRef.current) {
      setMapInstance(mapInstanceRef.current);
    }
  }, [mapInstanceRef.current]);

  const value = {
    map,
    markers,
    routes,
    currentLocation,
    destination,
    setMapMarkers,
    setMapRoutes,
    setUserCurrentLocation,
    setUserDestination,
    clearMapData
  };

  return (
    <GoogleMapsMapContext.Consumer>
      {(mapInstance) => {
        // Update our ref with the map instance from Google Maps
        if (mapInstance) {
          mapInstanceRef.current = mapInstance;
        }

        return (
          <MapContext.Provider value={value}>
            {children}
          </MapContext.Provider>
        );
      }}
    </GoogleMapsMapContext.Consumer>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};