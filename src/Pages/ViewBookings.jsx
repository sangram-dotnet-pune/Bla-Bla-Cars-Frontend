import React, { useEffect, useState } from "react";
import api from "../api/apiClient";

export default function ViewBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/booking");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Cancel booking?")) return;
    try {
      await api.put(`/booking/cancel/${id}`);
      alert("Cancelled");
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {loading && <div>Loading…</div>}
      {!loading && bookings.length === 0 && <div>No bookings found.</div>}

      <div className="space-y-3">
        {bookings.map(b => (
          <div key={b.bookingId} className="border rounded p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">Trip: {b.tripId}</div>
              <div>Seats: {b.seatsBooked}</div>
              <div>Status: {b.status}</div>
              <div>Total: ₹{b.totalAmount}</div>
            </div>
            <div>
              {b.status !== "Cancelled" && (
                <button onClick={() => handleCancel(b.bookingId)} className="px-3 py-1 bg-red-600 text-white rounded">Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
