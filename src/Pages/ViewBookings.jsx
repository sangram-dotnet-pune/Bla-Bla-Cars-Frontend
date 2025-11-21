import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";

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

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "text-green-600 font-bold";
      case "Cancelled":
        return "text-red-600 font-bold";
      default:
        return "text-blue-600 font-bold";
    }
  };

  return (
    <motion.div
      className="container mx-auto p-6 min-h-[80vh] bg-gray-50" // Added light background
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-extrabold mb-6 text-blue-600">My Bookings</h1>

      {/* Loading */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-blue-600"
        >
          Loading…
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && bookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-black"
        >
          No bookings found.
        </motion.div>
      )}

      {/* Bookings list */}
      <div className="space-y-4">
        <AnimatePresence>
          {bookings.map((b, i) => (
            <motion.div
              key={b.bookingId}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-xl p-5 flex justify-between items-center shadow-lg bg-white/60 backdrop-blur-md border border-white/50" // Glass UI Card
            >
              <div>
                <div>
                  <strong>Name:</strong> <span className="font-medium text-black">{b.passengerName}</span>
                </div>
                <div>
                  <strong>Seats:</strong> <span className="text-blue-600 font-semibold">{b.seatsBooked}</span>
                </div>
                <div>
                  <strong>Status:</strong> <span className={getStatusClass(b.status)}>{b.status}</span>
                </div>
                <div>
                  <strong>Total:</strong> <span className="text-green-700 font-extrabold">₹{b.totalAmount}</span>
                </div>
              </div>

              <div>
                {b.status !== "Cancelled" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCancel(b.bookingId)}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition" // Vibrant Red Cancel
                  >
                    Cancel
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}