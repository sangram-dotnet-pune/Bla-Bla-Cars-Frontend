import React, { useState } from "react";
import useTrips from "../Hooks/useTrips";
import TripCard from "../Components/TripCard";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiRefreshCw } from "react-icons/fi";

export default function Trips() {
  const { trips, loading, error, refresh } = useTrips();
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [sortBy, setSortBy] = useState("price");

  const filteredTrips = trips.filter((trip) => {
    const matchFrom = trip.startLocation.toLowerCase().includes(searchFrom.toLowerCase());
    const matchTo = trip.endLocation.toLowerCase().includes(searchTo.toLowerCase());
    return matchFrom && matchTo;
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "price") return a.pricePerSeat - b.pricePerSeat;
    if (sortBy === "availability") return b.availableSeats - a.availableSeats;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 pt-20">
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Find Your Perfect Ride</h1>
          <p className="text-blue-100 text-lg">Save on commute. Share the journey. Connect with others.</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* SEARCH & FILTER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* FROM */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                <FiMapPin className="inline mr-1 w-4 h-4" />
                From
              </label>
              <input
                type="text"
                placeholder="Departure location"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* TO */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                <FiMapPin className="inline mr-1 w-4 h-4" />
                To
              </label>
              <input
                type="text"
                placeholder="Destination"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* SORT */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                <FiSearch className="inline mr-1 w-4 h-4" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              >
                <option value="price">Lowest Price</option>
                <option value="availability">Most Available</option>
              </select>
            </div>

            {/* REFRESH */}
            <div className="flex items-end">
              <motion.button
                onClick={refresh}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Loading..." : "Refresh"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* RESULTS HEADER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex justify-between items-center"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {sortedTrips.length} {sortedTrips.length === 1 ? "Trip" : "Trips"} Found
            </h2>
            <p className="text-gray-600 text-sm mt-1">Choose your perfect ride below</p>
          </div>
        </motion.div>

        {/* ERROR STATE */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700 font-semibold mb-6"
          >
            ❌ {typeof error === "string" ? error : "Failed to load trips. Please ensure backend services are running."}
          </motion.div>
        )}

        {/* TRIPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl bg-white border border-gray-200 p-6 animate-pulse"
                >
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded-lg mt-4"></div>
                  </div>
                </motion.div>
              ))
            ) : sortedTrips.length > 0 ? (
              sortedTrips.map((trip, i) => (
                <motion.div
                  key={trip.tripId ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  layout
                >
                  <TripCard trip={trip} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Trips Found</h3>
                <p className="text-gray-600">
                  Try adjusting your search filters or check back later for more options.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
