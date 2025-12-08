import { useState } from "react";
import api from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiUsers } from "react-icons/fi";

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
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 space-y-6"
    >
      {/* Header */}
      <div className="mb-2">
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Book This Ride</h2>
        <p className="text-gray-500 text-sm mt-1">Complete your booking details below</p>
      </div>

      {/* Name Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          <span className="flex items-center gap-2">
            <FiUser className="w-4 h-4" />
            Your Name
          </span>
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter your full name"
          className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      {/* Seats Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          <span className="flex items-center gap-2">
            <FiUsers className="w-4 h-4" />
            Number of Seats
          </span>
        </label>
        <motion.input
          type="number"
          min="1"
          max="10"
          whileFocus={{ scale: 1.02 }}
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          required
          className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Price Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Price per Seat</span>
          <span className="text-lg font-bold text-gray-900">₹{pricePerSeat || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Number of Seats</span>
          <span className="text-lg font-bold text-gray-900">{seats}</span>
        </div>
        
        <AnimatePresence mode="popLayout">
          <motion.div
            key={total}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.25 }}
            className="border-t border-gray-200 pt-3 flex justify-between items-center"
          >
            <span className="text-base font-bold text-gray-900">Total Amount</span>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ₹{total}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            ✓ Confirm Booking
          </>
        )}
      </motion.button>

      <p className="text-xs text-gray-400 text-center">
        By confirming, you agree to our terms and conditions
      </p>
    </motion.form>
  );
}