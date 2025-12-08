import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { motion } from "framer-motion";
import { FiMapPin, FiClock, FiUsers, FiDollarSign, FiArrowRight } from "react-icons/fi";

export default function CreateTrip() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    startLocation: "",
    endLocation: "",
    departureTime: "",
    pricePerSeat: "",
    availableSeats: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/trip", form);
      alert("Trip created successfully!");
      navigate(`/`);
    } catch (err) {
      console.error(err);
      alert("Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex justify-center items-center p-4 pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 border border-gray-200 overflow-hidden"
      >
        {/* Header gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 -m-8 mb-8"></div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Publish a Ride
        </h2>
        <p className="text-gray-600 text-sm text-center mb-8">
          Share your journey and earn money
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Start Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Starting Location
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                name="startLocation"
                value={form.startLocation}
                onChange={handleChange}
                required
                placeholder="Where are you starting from?"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* End Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Destination
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                name="endLocation"
                value={form.endLocation}
                onChange={handleChange}
                required
                placeholder="Where are you going?"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Departure Time
            </label>
            <div className="relative">
              <FiClock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="datetime-local"
                name="departureTime"
                value={form.departureTime}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* Available Seats */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Available Seats
            </label>
            <div className="relative">
              <FiUsers className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="number"
                name="availableSeats"
                value={form.availableSeats}
                min="1"
                onChange={handleChange}
                required
                placeholder="How many seats?"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* Price Per Seat */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Price Per Seat
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="number"
                name="pricePerSeat"
                value={form.pricePerSeat}
                onChange={handleChange}
                required
                placeholder="₹0"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Trip...</span>
              </>
            ) : (
              <>
                <span>Publish Ride</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
