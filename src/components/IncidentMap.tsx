import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import { sampleIncidents, sampleHazards, sampleShelters, Incident } from "@/data/sampleData";

// Fill in your Google Maps API key:
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = { width: "100%", height: "100%" };
const center = { lat: 25.76, lng: -80.19 }; // Miami

export default function IncidentMap({
  incidents = sampleIncidents,
  hazards = sampleHazards,
  shelters = sampleShelters,
  onMapClick,
  onIncidentClick,
  pendingMarker,
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
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

    </GoogleMap>
  );
}