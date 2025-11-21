import React from "react";
import useTrips from "../hooks/useTrips";
import TripCard from "../Components/TripCard";

export default function Trips() {
  const { trips, loading, error, refresh } = useTrips();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Trips</h1>
        <button onClick={refresh} className="text-sm px-3 py-1 border rounded">Refresh</button>
      </div>

      {loading && <div>Loading trips…</div>}
      {error && <div className="text-red-600">Failed to load trips</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trips && trips.length ? trips.map(t => (
          <TripCard key={t.tripId ?? t.id} trip={t} />
        )) : <div>No trips found.</div>}
      </div>
    </div>
  );
}
