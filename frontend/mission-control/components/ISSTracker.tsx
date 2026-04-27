"use client";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.divIcon({
  html: `<div style="
    width: 50px;
    height: 50px;
    animation: pulse-glow 2s ease-in-out infinite;
    display: flex;
    align-items: center;
    justify-content: center;
  "><img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/ISS_spacecraft_model_1.png" style="
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.9));
  " /></div>`,
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  className: "",
});

function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom(), { animate: true });
  }, [lat, lon, map]);
  return null;
}

export default function ISSTracker() {
  const [position, setPosition] = useState<{ latitude: number; longitude: number; timestamp: number } | null>(null);
  const [tick, setTick] = useState(0);

  const fetchPosition = async () => {
    const res = await fetch("http://localhost:8000/api/iss-location");
    const data = await res.json();
    setPosition(data);
    setTick(t => t + 1);
  };

  useEffect(() => {
    fetchPosition();
    const interval = setInterval(fetchPosition, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700&display=swap');

        .tracker-wrapper {
          font-family: 'Share Tech Mono', monospace;
        }

        .section-label {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: rgba(7, 137, 255,0.5);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(7, 137, 255,0.3), transparent);
        }

        .tracker-card {
          background: rgba(5, 0, 15, 0.8);
          border: 1px solid rgba(0, 255, 100, 0.25);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 0 40px rgba(7, 137, 255,0.05), inset 0 0 40px rgba(0,0,0,0.5);
          backdrop-filter: blur(10px);
        }

        .tracker-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .tracker-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #a855f7;
          letter-spacing: 0.15em;
          text-shadow: 0 0 10px rgba(7, 137, 255,0.5);
        }

        .live-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(7, 137, 255,0.08);
          border: 1px solid rgba(7, 137, 255,0.3);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 0.65rem;
          color: #a855f7;
          letter-spacing: 0.2em;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          background: #a855f7;
          border-radius: 50%;
          animation: blink 1s ease-in-out infinite;
          box-shadow: 0 0 6px #a855f7;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        .coords-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .coord-card {
          background: rgba(7, 137, 255,0.04);
          border: 1px solid rgba(7, 137, 255,0.15);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          position: relative;
          overflow: hidden;
        }

        .coord-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(7, 137, 255,0.6), transparent);
        }

        .coord-label {
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          color: rgba(7, 137, 255,0.45);
          margin-bottom: 0.4rem;
        }

        .coord-value {
          font-size: 1.1rem;
          color: #a855f7;
          text-shadow: 0 0 8px rgba(7, 137, 255,0.4);
        }

        .map-container {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(7, 137, 255,0.2);
          box-shadow: 0 0 30px rgba(7, 137, 255,0.05);
        }

        .loading-state {
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: rgba(7, 137, 255,0.6);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          border: 1px solid rgba(7, 137, 255,0.15);
          border-radius: 12px;
          background: rgba(0,10,5,0.8);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(7, 137, 255,0.15);
          border-top-color: #a855f7;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          box-shadow: 0 0 15px rgba(7, 137, 255,0.3);
        }

       @keyframes pulse-glow {
        0%, 100% { filter: drop-shadow(0 0 4px rgba(168, 85, 247, 0.4)); opacity: 0.7; }
         50% { filter: drop-shadow(0 0 14px rgba(168, 85, 247, 1)); opacity: 1; }
        }

        .leaflet-container {
          background: #00000f !important;
        }
      `}</style>

      <div className="tracker-wrapper">
        <div className="section-label">ISS TRACKING MODULE</div>

        {!position ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            ACQUIRING ISS SIGNAL...
          </div>
        ) : (
          <div className="tracker-card">
            <div className="tracker-header">
              <span className="tracker-title">INTERNATIONAL SPACE STATION</span>
              <span className="live-badge">
                <span className="live-dot" />
                LIVE FEED
              </span>
            </div>

            <div className="coords-grid">
              <div className="coord-card">
                <div className="coord-label">LATITUDE</div>
                <div className="coord-value">{position.latitude.toFixed(4)}°</div>
              </div>
              <div className="coord-card">
                <div className="coord-label">LONGITUDE</div>
                <div className="coord-value">{position.longitude.toFixed(4)}°</div>
              </div>
              <div className="coord-card">
                <div className="coord-label">LAST PING</div>
                <div className="coord-value" style={{ fontSize: "0.85rem" }}>
                  {new Date(position.timestamp * 1000).toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className="map-container">
              <MapContainer
                center={[position.latitude, position.longitude]}
                zoom={3}
                style={{ height: "450px", width: "100%" }}
                zoomControl={false}
              >
              <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                attribution='&copy; Stadia Maps'
              />
                <MapUpdater lat={position.latitude} lon={position.longitude} />
                <Marker position={[position.latitude, position.longitude]} icon={icon}>
                  <Popup>ISS is Here! @ {new Date(position.timestamp * 1000).toLocaleTimeString()}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </>
  );
}