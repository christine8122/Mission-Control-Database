"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue with Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function ISSTracker() {
  const [position, setPosition] = useState(null);

  const fetchPosition = async () => {
    const res = await fetch("http://localhost:8000/api/iss-location");
    const data = await res.json();
    setPosition(data);
  };

  useEffect(() => {
    fetchPosition();
    // Refresh every 5 seconds
    const interval = setInterval(fetchPosition, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!position) return <p style={{ color: "white" }}>Loading ISS position...</p>;

  return (
    <div>
      <h2 style={{ color: "white" }}>ISS Live Tracker</h2>
      <p style={{ color: "white" }}>
        Lat: {position.latitude} | Lon: {position.longitude}
      </p>
      <MapContainer
        center={[position.latitude, position.longitude]}
        zoom={3}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[position.latitude, position.longitude]} icon={icon}>
          <Popup>ISS is here!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}