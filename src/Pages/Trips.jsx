import React from "react";
import useTrips from "../Hooks/useTrips";
import TripCard from "../Components/TripCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Trips() {
  const { trips, loading, error, refresh } = useTrips();

  return (
    <motion.div
      className="container mx-auto p-6 min-h-[80vh] bg-gray-50" // Added light background
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-600">Available Trips</h1>

        <motion.button
          onClick={refresh}
          whileHover={{ scale: 1.05, backgroundColor: "#0077B6" }}
          whileTap={{ scale: 0.95 }}
          className="text-sm px-4 py-2 bg-yellow-400 text-black font-semibold rounded-full shadow-md transition-colors" // Secondary color button
        >
          Refresh
        </motion.button>
      </div>

      {loading && <div className="text-blue-600">Loading trips…</div>}
      {error && <div className="text-red-600">Failed to load trips</div>}

      {/* Trips List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {trips && trips.length ? (
            trips.map((t, i) => (
              <motion.div
                key={t.tripId ?? t.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <TripCard trip={t} />
              </motion.div>
            ))
          ) : (
            !loading && (
              <motion.div
                className="text-black" // Changed from text-gray-600
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No trips found.
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}