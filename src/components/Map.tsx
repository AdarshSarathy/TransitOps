"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";

const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "100%",
  borderRadius: "0.75rem", // 12px
};

const CENTER = {
  lat: 23.0225, // Ahmedabad Hub
  lng: 72.5714,
};

// Snazzy Maps 'Aubergine' style for dark mode consistency
const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#64779e" }] },
  { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
  { featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [{ color: "#334e87" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#023e58" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#283d6a" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6f9ba5" }] },
  { featureType: "poi", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
  { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#023e58" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#3C7680" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#98a5be" }] },
  { featureType: "road", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c6675" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#255763" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#b0d5ce" }] },
  { featureType: "road.highway", elementType: "labels.text.stroke", stylers: [{ color: "#023e58" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#98a5be" }] },
  { featureType: "transit", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
  { featureType: "transit.line", elementType: "geometry.fill", stylers: [{ color: "#283d6a" }] },
  { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#3a4762" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4e6d70" }] }
];

export const LOCATIONS: Record<string, { lat: number; lng: number }> = {
  "Gandhinagar Depot": { lat: 23.2156, lng: 72.6369 },
  "Ahmedabad Hub": { lat: 23.0225, lng: 72.5714 },
  "Vatva Industrial Area": { lat: 22.9526, lng: 72.6105 },
  "Sanand Warehouse": { lat: 22.9906, lng: 72.3817 },
};

interface MapProps {
  source?: string;
  destination?: string;
}

export function Map({ source, destination }: MapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const fetchDirections = useCallback(() => {
    if (!source || !destination) {
      setDirections(null);
      return;
    }

    const sourceCoords = LOCATIONS[source];
    const destCoords = LOCATIONS[destination];

    if (!sourceCoords || !destCoords || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: sourceCoords,
        destination: destCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
          setDirections(null);
        }
      }
    );
  }, [source, destination]);

  useEffect(() => {
    if (isLoaded && source && destination) {
      fetchDirections();
    } else if (!source || !destination) {
      setDirections(null);
    }
  }, [isLoaded, source, destination, fetchDirections]);

  // Fallback UI when API key is missing or failed to load
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || loadError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-[#1e1e2e] bg-[#111119] p-6 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1e1e2e]">
          <svg className="h-6 w-6 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-white">Live Map Unavailable</h3>
        <p className="mt-1 text-xs text-[#6b7280]">
          Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables to enable route visualization.
        </p>
        
        {/* Simple textual representation if route is selected */}
        {source && destination && (
          <div className="mt-4 flex w-full max-w-sm items-center gap-3 rounded-lg border border-[#2a2a3e] bg-[#0a0a12] p-3 text-left">
            <div className="flex flex-1 flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Source</span>
              <span className="truncate text-sm text-white">{source}</span>
            </div>
            <svg className="h-4 w-4 flex-shrink-0 text-[#d4910a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="flex flex-1 flex-col text-right">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Destination</span>
              <span className="truncate text-sm text-white">{destination}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-[#1e1e2e] bg-[#111119]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#d4910a] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-[#1e1e2e]">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={CENTER}
        zoom={11}
        options={{
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#d4910a",
                strokeWeight: 4,
                strokeOpacity: 0.8,
              }
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
