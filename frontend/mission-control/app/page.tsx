"use client";

import dynamic from "next/dynamic";

const ISSTracker = dynamic(() => import("../components/ISSTracker"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-black p-8">
      <h1 className="text-white text-3xl font-bold mb-8">NASA Mission Control</h1>
      <ISSTracker />
    </main>
  );
}