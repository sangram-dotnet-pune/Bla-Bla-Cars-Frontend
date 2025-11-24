import React from "react";
import useTrips from "../Hooks/useTrips";
import TripCard from "../Components/TripCard";
import { motion, AnimatePresence } from "framer-motion";
import Galaxy from "../Components/Galaxy";

export default function Trips() {
  const { trips, loading, error, refresh } = useTrips();

  return (
    <div className="relative w-full min-h-[100vh] overflow-hidden">
      
      {/* --- GALAXY BACKGROUND (behind everything) --- */}
      <div className="absolute inset-0 -z-20">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.2}
          glowIntensity={0.4}
          saturation={0.8}
          hueShift={240}
        />
      </div>

      {/* --- MAIN PAGE CONTENT --- */}
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

        {/* Trip list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {trips && trips.length > 0 ? (
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
