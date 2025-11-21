import { useState } from "react";
import api from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";

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
      // Glass UI Styling applied here
      className="space-y-5 p-6 rounded-2xl shadow-xl backdrop-blur-md bg-white/60 border border-white/50" 
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-black">Your name</label>
        <motion.input
          whileFocus={{ scale: 1.01, borderColor: "#0077B6", boxShadow: "0 0 10px rgba(0, 119, 182, 0.4)" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 w-full border border-blue-200 rounded px-4 py-2 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/80" // Input Glass Style
        />
      </div>

      {/* Seats */}
      <div>
        <label className="block text-sm font-semibold text-black">Seats</label>
        <motion.input
          type="number"
          min="1"
          max="10"
          whileFocus={{ scale: 1.01, borderColor: "#38B000", boxShadow: "0 0 10px rgba(56, 176, 0, 0.4)" }}
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          required
          className="mt-1 w-32 border border-blue-200 rounded px-4 py-2 transition-all focus:ring-2 focus:ring-green-400 focus:outline-none bg-white/80" // Input Glass Style
        />
      </div>

      {/* Total Amount – animated */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={total}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          className="text-right pt-2"
        >
          <p className="text-base text-black">
            Total Price:{" "}
            <span className="font-extrabold text-2xl text-green-700">₹{total}</span>
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.01, backgroundColor: "#2e8b57" }}
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white font-bold px-4 py-3 rounded-full w-full shadow-lg disabled:opacity-50 transition-colors" // Success Button
      >
        {loading ? "Processing..." : "Confirm Booking"}
      </motion.button>
    </motion.form>
  );
}