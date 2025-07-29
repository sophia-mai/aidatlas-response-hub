import { GoogleMap, Marker, InfoWindow, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import { sampleIncidents, sampleHazards, sampleShelters, Incident } from "@/data/sampleData";
import { Polyline } from "@react-google-maps/api";

// Fill in your Google Maps API key:
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = { width: "100%", height: "100%" };
const center = { lat: 25.76, lng: -80.19 }; // Miami

function isPointNearHazard(latLng, hazards, radiusMeters = 50) {
  if (!window.google || !window.google.maps) return false;
  const { computeDistanceBetween } = window.google.maps.geometry.spherical;
  return hazards.some(hazard => {
    const hazardLatLng = new window.google.maps.LatLng(hazard.location.lat, hazard.location.lng);
    return computeDistanceBetween(latLng, hazardLatLng) < radiusMeters;
  });
}

function getRouteSegments(overview_path, hazards, radiusMeters = 50) {
  const dangerSegments = [];
  const safeSegments = [];

  for (let i = 0; i < overview_path.length - 1; i++) {
    const a = overview_path[i];
    const b = overview_path[i + 1];

    const aNear = isPointNearHazard(a, hazards, radiusMeters);
    const bNear = isPointNearHazard(b, hazards, radiusMeters);

    if (aNear || bNear) {
      dangerSegments.push([a, b]);
    } else {
      safeSegments.push([a, b]);
    }
  }
  return { dangerSegments, safeSegments };
}

function haversineDistance(a: {lat: number, lng: number}, b: {lat: number, lng: number}) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
  const aComp = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(aComp), Math.sqrt(1-aComp));
  return R * c; // distance in meters
}

type LatLng = { lat: number; lng: number };

interface IncidentMapProps {
  incidents?: Incident[];
  hazards?: any[];
  shelters?: any[];
  onMapClick?: (latlng: LatLng) => void;
  onIncidentClick?: (incident: Incident) => void;
  pendingMarker?: LatLng | null;
  center: LatLng;
  directions?: google.maps.DirectionsResult | null;
}

export default function IncidentMap({
  incidents = sampleIncidents,
  hazards = sampleHazards,
  shelters = sampleShelters,
  onMapClick,
  onIncidentClick,
  pendingMarker,
  center,
  directions,
}
) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['geometry'],
  });
  
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading Map…</div>;

  // Marker icons: you can use SVGs, or Google’s built-in colors
  const icons = {
    incident: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    hazard: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    shelter: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={center}
      options={{
        disableDefaultUI: false,
      }}
      onClick={event => {
        if (onMapClick) {
          onMapClick({
            lat: event.latLng?.lat() ?? center.lat,
            lng: event.latLng?.lng() ?? center.lng,
          });
        }
      }}
    >
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={incident.location}
          icon={icons.incident}
          onClick={() => setSelectedIncident(incident)}
        />
      ))}
      {hazards.map((hazard) => (
        <Marker
          key={hazard.id}
          position={hazard.location}
          icon={icons.hazard}
          title={hazard.title}
        />
      ))}
      {shelters.map((shelter) => (
        <Marker
          key={shelter.id}
          position={shelter.location}
          icon={icons.shelter}
          title={shelter.name}
        />
      ))}

      {selectedIncident && (
        <InfoWindow
          position={selectedIncident.location}
          onCloseClick={() => setSelectedIncident(null)}
        >
          <div>
            <strong>{selectedIncident.title}</strong>
            <div>{selectedIncident.address}</div>
            <div>{selectedIncident.description}</div>
          </div>
        </InfoWindow>
      )}

      {pendingMarker && (
        <Marker
        position={pendingMarker}
        icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new window.google.maps.Size(38, 38),
        }}
        // You may want to add animation: google.maps.Animation.DROP
        />
      )}
      {directions && <DirectionsRenderer directions={directions} />}

      {incidents.map((incident) => (
        <Marker
            key={incident.id}
            position={incident.location}
            icon={icons.incident}
            onClick={() => setSelectedIncident(incident)}
        />
        ))}

      {directions && hazards?.length > 0 && (() => {
        const overview_path = directions.routes[0].overview_path;
        const { dangerSegments, safeSegments } = getRouteSegments(overview_path, hazards, 50); // radiusMeters
        return (
            <>
            {/* Red danger segments */}
            {dangerSegments.map((seg, idx) => (
                <Polyline
                key={`danger-${idx}`}
                path={seg}
                options={{
                    strokeColor: 'red',
                    strokeOpacity: 0.85,
                    strokeWeight: 6,
                    zIndex: 100,
                }}
                />
            ))}
            {/* Safe segments in primary color */}
            {safeSegments.map((seg, idx) => (
                <Polyline
                key={`safe-${idx}`}
                path={seg}
                options={{
                    strokeColor: '#1976d2',
                    strokeOpacity: 0.70,
                    strokeWeight: 5,
                    zIndex: 99,
                }}
                />
            ))}
            </>
        );
        })()}

    </GoogleMap>
  );
}