"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const ISSTracker = dynamic(() => import("../components/ISSTracker"), {
  ssr: false,
});

const LaunchSchedule = dynamic(() => import("../components/LaunchSchedule"), {
  ssr: false,
});

export default function Home() {
  useEffect(() => {
    const container = document.getElementById('stars');
    if (!container) return;
    for (let i = 0; i < 200; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2.5 + 0.5;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        --duration: ${Math.random() * 4 + 2}s;
        --max-opacity: ${Math.random() * 0.8 + 0.2};
        animation-delay: ${Math.random() * 5}s;
      `;
      container.appendChild(star);
    }
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #05000f;
          font-family: 'Share Tech Mono', monospace;
          overflow-x: hidden;
        }

        .stars {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle var(--duration) ease-in-out infinite;
          opacity: 0;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: var(--max-opacity); }
        }

        .scanline {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(168, 85, 247, 0.015) 2px,
            rgba(168, 85, 247, 0.015) 4px
          );
        }

        .vignette {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.85) 100%);
        }

        .page {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          padding: 2rem;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
          border-bottom: 1px solid rgba(168, 85, 247, 0.2);
          padding-bottom: 1.5rem;
        }

        .logo-ring {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2px solid #a855f7;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(168, 85, 247, 0.1);
          animation: pulse-ring 3s ease-in-out infinite;
          font-size: 1.4rem;
        }

        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(168, 85, 247, 0.1); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.7), inset 0 0 30px rgba(168, 85, 247, 0.2); }
        }

        .header-text h1 {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 1.6rem;
          letter-spacing: 0.2em;
          color: #a855f7;
          text-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
        }

        .header-text p {
          font-size: 0.7rem;
          color: rgba(168, 85, 247, 0.5);
          letter-spacing: 0.3em;
          margin-top: 2px;
        }

        .status-bar {
          display: flex;
          gap: 2rem;
          margin-left: auto;
          font-size: 0.65rem;
          color: rgba(168, 85, 247, 0.5);
          letter-spacing: 0.15em;
        }

        .status-item {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .status-value {
          color: #a855f7;
          font-size: 0.75rem;
        }

        .section-label {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: rgba(168, 85, 247, 0.5);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(168, 85, 247, 0.3), transparent);
        }
      `}</style>

      <div className="stars" id="stars" />
      <div className="scanline" />
      <div className="vignette" />

      <div className="page">
        <header className="header">
          <div className="logo-ring">🛸</div>
          <div className="header-text">
            <h1>MISSION CONTROL</h1>
            <p>NASA DEEP SPACE OPERATIONS CENTER</p>
          </div>
          <div className="status-bar">
            <div className="status-item">
              <span>SYSTEM</span>
              <span className="status-value">NOMINAL</span>
            </div>
            <div className="status-item">
              <span>UPLINK</span>
              <span className="status-value">ACTIVE</span>
            </div>
          </div>
        </header>

        <ISSTracker />
        <LaunchSchedule />
      </div>
    </>
  );
}