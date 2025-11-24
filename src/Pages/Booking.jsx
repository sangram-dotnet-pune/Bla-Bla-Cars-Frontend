import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import BookingForm from "../Components/BookingForm";
import { motion } from "framer-motion";
import Threads from "../Components/Threads";

export default function Booking() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) return;

    (async () => {
      try {
        const res = await api.get(`/api/Trip/${tripId}`);
        setTrip(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load trip");
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  const handleSuccess = () => {
    alert("Booking successful!");
    navigate("/bookings");
  };

  if (loading)
    return <div className="container mx-auto p-6 text-blue-600">Loading…</div>;

  if (!trip)
    return (
      <div className="container mx-auto p-6 text-red-600">Trip not found.</div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* 🔵 RippleGrid Background */}
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Threads
    amplitude={1}
    distance={0}
    enableMouseInteraction={true}
  />
</div>

      {/* Foreground Content (glass, transparent) */}
      <motion.div
        className="container mx-auto p-6 min-h-[80vh] bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid md:grid-cols-2 gap-6">

          {/* Trip Details – Glass Card */}
          <motion.div
            className="rounded-xl p-6 shadow-xl bg-white/30 backdrop-blur-lg border border-white/40"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Trip Details</h2>

            <div className="space-y-3 text-black">
              <p className="flex justify-between">
                <strong>From:</strong> <span>{trip.startLocation}</span>
              </p>

              <p className="flex justify-between">
                <strong>To:</strong> <span>{trip.endLocation}</span>
              </p>

              <p className="flex justify-between">
                <strong>Departure:</strong>{" "}
                <span>{new Date(trip.departureTime).toLocaleString()}</span>
              </p>

              <p className="flex justify-between">
                <strong>Available seats:</strong>
                <span className="text-green-700 font-bold">
                  {trip.availableSeats}
                </span>
              </p>

              <p className="flex justify-between border-t pt-3 mt-3 border-white/50">
                <strong className="text-xl">Price per seat:</strong>
                <span className="text-xl font-extrabold text-blue-600">
                  ₹{trip.pricePerSeat}
                </span>
              </p>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-2 text-blue-600">Book now</h2>

            <BookingForm
              tripId={trip.tripId}
              pricePerSeat={trip.pricePerSeat}
              onSuccess={handleSuccess}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
