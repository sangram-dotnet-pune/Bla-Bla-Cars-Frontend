import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import BookingForm from "../Components/BookingForm";

export default function Booking() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) return;
    (async () => {
      try {
        const res = await api.get(`/api/trip/${tripId}`);
        setTrip(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load trip");
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  const handleSuccess = (booking) => {
    alert("Booking successful!");
    navigate("/bookings");
  };

  if (loading) return <div className="container mx-auto p-6">Loading…</div>;
  if (!trip) return <div className="container mx-auto p-6">Trip not found.</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Trip Details</h2>
          <p><strong>From:</strong> {trip.startCity ?? trip.StartLocation?? "—"}</p>
          <p><strong>To:</strong> {trip.endCity ?? trip.EndLocation ?? "—"}</p>
          <p><strong>Departure:</strong> {new Date(trip.DepartureTime ?? trip.startTime).toLocaleString()}</p>
          <p><strong>Available seats:</strong> {trip.AvailableSeats}</p>
          <p><strong>Price per seat:</strong> ₹{trip.PricePerSeat ?? trip.price}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Book now</h2>
          <BookingForm tripId={trip.tripId ?? trip.id} pricePerSeat={trip.pricePerSeat ?? trip.price} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
