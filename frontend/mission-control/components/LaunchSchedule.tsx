"use client";
import { useEffect, useState } from "react";

interface Launch {
  id: string;
  name: string;
  status: string;
  net: string;
  mission: string;
  pad: string;
  location: string;
  image: string;
}

type Filter = "ALL" | "SATELLITE" | "CREWED" | "CARGO";

export default function LaunchSchedule() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Launch | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");

  useEffect(() => {
    fetch("http://localhost:8000/api/launches")
      .then(res => res.json())
      .then(data => {
        setLaunches(data);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }),
    };
  };

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("go")) return "#a855f7";
    if (status.toLowerCase().includes("success")) return "#22c55e";
    if (status.toLowerCase().includes("hold")) return "#f97316";
    return "rgba(168,85,247,0.5)";
  };

  const filteredLaunches = launches.filter(launch => {
    const m = launch.mission.toLowerCase();
    const n = launch.name.toLowerCase();
    if (filter === "ALL") return true;
    if (filter === "SATELLITE") return m.includes("satellite") || m.includes("constellation") || m.includes("starlink") || m.includes("kuiper") || n.includes("starlink");
    if (filter === "CREWED") return m.includes("crew") || m.includes("astronaut") || m.includes("cosmonaut") || n.includes("crew") || n.includes("soyuz ms");
    if (filter === "CARGO") return m.includes("cargo") || m.includes("resupply") || m.includes("cygnus") || n.includes("cargo");
    return true;
  });

  const filters: Filter[] = ["ALL", "SATELLITE", "CREWED", "CARGO"];

  return (
    <>
      <style>{`
        .filter-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .filter-btn {
          background: none;
          border: 1px solid rgba(168, 85, 247, 0.25);
          color: rgba(168, 85, 247, 0.5);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          padding: 5px 14px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: rgba(168, 85, 247, 0.5);
          color: rgba(168, 85, 247, 0.8);
        }

        .filter-btn.active {
          background: rgba(168, 85, 247, 0.15);
          border-color: #a855f7;
          color: #a855f7;
          box-shadow: 0 0 12px rgba(168, 85, 247, 0.2);
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: rgba(168, 85, 247, 0.35);
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          border: 1px solid rgba(168, 85, 247, 0.1);
          border-radius: 10px;
        }

        .launches-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .launch-row {
          background: rgba(5, 0, 15, 0.8);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 10px;
          padding: 1rem 1.25rem;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .launch-row:hover, .launch-row.active {
          border-color: rgba(168, 85, 247, 0.6);
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.1);
        }

        .launch-image {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid rgba(168, 85, 247, 0.2);
          flex-shrink: 0;
          background: rgba(168,85,247,0.05);
        }

        .launch-info {
          flex: 1;
          min-width: 0;
        }

        .launch-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.7rem;
          color: #a855f7;
          letter-spacing: 0.05em;
          margin-bottom: 0.3rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 0 0 8px rgba(168,85,247,0.4);
        }

        .launch-meta {
          font-size: 0.65rem;
          color: rgba(168, 85, 247, 0.5);
          letter-spacing: 0.1em;
          margin-bottom: 0.4rem;
        }

        .launch-status {
          display: inline-block;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          padding: 2px 8px;
          border-radius: 20px;
          border: 1px solid currentColor;
        }

        .launch-date {
          text-align: right;
          flex-shrink: 0;
        }

        .date-day {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.75rem;
          color: rgba(168,85,247,0.8);
          white-space: nowrap;
        }

        .date-time {
          font-size: 0.6rem;
          color: rgba(168,85,247,0.45);
          white-space: nowrap;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .modal {
          background: rgba(5, 0, 15, 0.95);
          border: 1px solid rgba(168, 85, 247, 0.4);
          border-radius: 14px;
          padding: 2rem;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 0 60px rgba(168, 85, 247, 0.15);
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: 1px solid rgba(168, 85, 247, 0.3);
          color: rgba(168, 85, 247, 0.6);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          padding: 4px 12px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-close:hover {
          border-color: #a855f7;
          color: #a855f7;
        }

        .modal-header {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          margin-bottom: 1.25rem;
        }

        .modal-image {
          width: 100px;
          height: 100px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid rgba(168, 85, 247, 0.3);
          flex-shrink: 0;
        }

        .modal-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.85rem;
          color: #a855f7;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
          text-shadow: 0 0 10px rgba(168,85,247,0.5);
        }

        .modal-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .modal-field {
          font-size: 0.65rem;
          color: rgba(168, 85, 247, 0.5);
          letter-spacing: 0.1em;
        }

        .modal-field span {
          display: block;
          color: rgba(168, 85, 247, 0.9);
          margin-top: 2px;
        }

        .modal-mission {
          font-size: 0.7rem;
          color: rgba(168, 85, 247, 0.6);
          line-height: 1.6;
          border-top: 1px solid rgba(168, 85, 247, 0.15);
          padding-top: 0.75rem;
        }

        .loading-state {
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: rgba(168, 85, 247, 0.6);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          border: 1px solid rgba(168,85,247,0.15);
          border-radius: 12px;
          background: rgba(5,0,15,0.8);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(168,85,247,0.15);
          border-top-color: #a855f7;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          box-shadow: 0 0 15px rgba(168,85,247,0.3);
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ marginTop: "2rem" }}>
        <div className="section-label">UPCOMING LAUNCH SCHEDULE</div>

        <div className="filter-bar">
          {filters.map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            FETCHING LAUNCH DATA...
          </div>
        ) : (
          <div className="launches-grid">
            {filteredLaunches.length === 0 ? (
              <div className="no-results">NO {filter} LAUNCHES SOON</div>
            ) : (
              filteredLaunches.map(launch => {
                const { date, time } = formatDate(launch.net);
                return (
                  <div
                    key={launch.id}
                    className={`launch-row ${selected?.id === launch.id ? "active" : ""}`}
                    onClick={() => setSelected(selected?.id === launch.id ? null : launch)}
                  >
                    <img className="launch-image" src={launch.image} alt={launch.name} />
                    <div className="launch-info">
                      <div className="launch-name">{launch.name}</div>
                      <div className="launch-meta">{launch.location}</div>
                      <span className="launch-status" style={{ color: getStatusColor(launch.status) }}>
                        {launch.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="launch-date">
                      <div className="date-day">{date}</div>
                      <div className="date-time">{time}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelected(null)}>CLOSE</button>
              <div className="modal-header">
                <img className="modal-image" src={selected.image} alt={selected.name} />
                <div>
                  <div className="modal-title">{selected.name}</div>
                  <div className="modal-fields">
                    <div className="modal-field">LAUNCH PAD <span>{selected.pad}</span></div>
                    <div className="modal-field">LOCATION <span>{selected.location}</span></div>
                    <div className="modal-field">STATUS <span style={{ color: getStatusColor(selected.status) }}>{selected.status}</span></div>
                    <div className="modal-field">NET <span>{formatDate(selected.net).date} {formatDate(selected.net).time}</span></div>
                  </div>
                </div>
              </div>
              <div className="modal-mission">{selected.mission}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}