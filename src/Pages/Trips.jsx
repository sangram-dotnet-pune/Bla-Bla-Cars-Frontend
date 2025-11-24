import React from "react";
import useTrips from "../Hooks/useTrips";
import TripCard from "../Components/TripCard";
import { motion, AnimatePresence } from "framer-motion";
import FloatingLines from "../Components/FloatingLines"; // <-- ADD THIS

export default function Trips() {
  const { trips, loading, error, refresh } = useTrips();

  return (
    <div className="relative w-full min-h-[100vh] overflow-hidden">
      {/* --- FLOATING BACKGROUND --- */}
      <div className="absolute inset-0 -z-0">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[10, 15, 20]}
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>

      {/* --- PAGE CONTENT --- */}
      <motion.div
        className="relative z-10 container mx-auto p-6 min-h-[80vh] text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-yellow-300 drop-shadow-lg">
            Available Trips
          </h1>

          <motion.button
            onClick={refresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm px-4 py-2 bg-yellow-400 text-black font-semibold rounded-full shadow-md"
          >
            Refresh
          </motion.button>
        </div>

        {loading && <div className="text-yellow-300">Loading trips…</div>}
        {error && <div className="text-red-400">Failed to load trips</div>}

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
                  className="text-white"
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
    </div>
  );
}
