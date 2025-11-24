import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { motion } from "framer-motion";
import Threads from "../Components/Threads";

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
    <div className="relative min-h-screen overflow-hidden flex justify-center items-center p-4">

      {/* 🔵 FULLSCREEN THREADS BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>
    {/* <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800"> */}
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white/50 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-white/30"
      >
        <h2 className="text-3xl font-bold text-black mb-6 text-center">
          Create a New Trip
        </h2>

     <form className="space-y-5" onSubmit={handleSubmit}>

  {/* Start Location */}
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700">Start Location</label>
    <input
      type="text"
      name="startLocation"
      value={form.startLocation}
      onChange={handleChange}
      required
      placeholder="Enter starting point"
      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-300 text-gray-900 
                 focus:outline-none focus:border-black focus:ring-0 placeholder:text-gray-500"
    />
  </div>

  {/* End Location */}
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700">End Location</label>
    <input
      type="text"
      name="endLocation"
      value={form.endLocation}
      onChange={handleChange}
      required
      placeholder="Enter destination"
      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-300 text-gray-900 
                 focus:outline-none focus:border-black focus:ring-0 placeholder:text-gray-500"
    />
  </div>

  {/* Departure Time */}
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700">Departure Time</label>
    <input
      type="datetime-local"
      name="departureTime"
      value={form.departureTime}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-300 text-gray-900 
                 focus:outline-none focus:border-black focus:ring-0"
    />
  </div>

  {/* Price Per Seat */}
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700">Price Per Seat</label>
    <input
      type="number"
      name="pricePerSeat"
      value={form.pricePerSeat}
      onChange={handleChange}
      required
      placeholder="₹"
      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-300 text-gray-900
                 focus:outline-none focus:border-black focus:ring-0 placeholder:text-gray-500"
    />
  </div>

  {/* Available Seats */}
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700">Available Seats</label>
    <input
      type="number"
      name="availableSeats"
      value={form.availableSeats}
      min="1"
      onChange={handleChange}
      required
      placeholder="Number of seats"
      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-300 text-gray-900 
                 focus:outline-none focus:border-black focus:ring-0 placeholder:text-gray-500"
    />
  </div>

  {/* Submit Button */}
  <button
    disabled={loading}
    className="w-full bg-black hover:bg-gray-700 text-white py-3 rounded-xl shadow-lg font-bold mt-4 transition"
  >
    {loading ? "Creating..." : "Create Trip"}
  </button>
</form>


      </motion.div>
    {/* </div> */}
    </div>
  );
}
