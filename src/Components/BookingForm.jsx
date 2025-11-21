import { useState } from "react";
import api from "../api/apiClient";

export default function BookingForm({ tripId, pricePerSeat, onSuccess }) {
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const total = (seats || 0) * (pricePerSeat || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        tripId,
        passengerName: name,
        seatsBooked: Number(seats),
      };
      const res = await api.post("/booking", payload);
      setLoading(false);
      onSuccess?.(res.data);
    } catch (err) {
      console.error("Booking failed", err);
      alert(err?.response?.data ?? "Booking failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded shadow-sm">
      <div>
        <label className="block text-sm font-medium">Your name</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2"/>
      </div>

      <div>
        <label className="block text-sm font-medium">Seats</label>
        <input type="number" min="1" max="10" value={seats} onChange={(e)=>setSeats(e.target.value)} required className="mt-1 w-32 border rounded px-3 py-2"/>
      </div>

      <div className="text-right">
        <div className="text-sm text-gray-600">Total: <span className="font-semibold">₹{total}</span></div>
      </div>

      <div>
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
}
