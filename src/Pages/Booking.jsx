import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import BookingForm from "../Components/BookingForm";
import { motion } from "framer-motion";
import { FiMapPin, FiClock, FiUsers, FiDollarSign } from "react-icons/fi";

export default function Booking() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState("Owner");

  useEffect(() => {
    if (!tripId) return;

    (async () => {
      try {
        const res = await api.get(`/api/Trip/${tripId}`);
        setTrip(res.data);
        
        // Fetch owner name
        if (res.data?.ownerId) {
          try {
            const userRes = await api.get(`/user/${res.data.ownerId}`);
            setOwnerName(userRes.data?.fullName || userRes.data?.name || "Owner");
          } catch (err) {
            console.error("Failed to load owner", err);
          }
        }
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="inline-block">
            <svg className="animate-spin w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading trip details...</p>
        </div>
      </div>
    );

  if (!trip)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-gray-600 font-medium">Trip not found.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Your Ride</h1>
          <p className="text-gray-600">Complete your booking to secure your seat</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Trip Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                📍 Trip Details
              </h2>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Route */}
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">From</p>
                    <p className="text-xl font-bold text-gray-900">{trip.startLocation}</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="h-8 border-l-2 border-gray-300" />
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-1">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">To</p>
                    <p className="text-xl font-bold text-gray-900">{trip.endLocation}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200" />

              {/* Departure Time */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
                  <FiClock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Departure Time</p>
                  <p className="text-lg font-bold text-gray-900">{new Date(trip.departureTime).toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t border-gray-200" />

              {/* Available Seats */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                  <FiUsers className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Available Seats</p>
                  <p className="text-lg font-bold text-green-600">{trip.availableSeats} seats available</p>
                </div>
              </div>

              <div className="border-t border-gray-200" />
            </div>
          </motion.div>

          {/* Booking Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <BookingForm
              tripId={trip.tripId}
              pricePerSeat={trip.pricePerSeat}
              onSuccess={handleSuccess}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}