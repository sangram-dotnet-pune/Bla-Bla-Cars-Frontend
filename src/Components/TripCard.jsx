import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function TripCard({ trip }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.3 }}
      className="relative rounded-xl p-5 shadow-lg bg-white/40 
                 backdrop-blur-lg border border-white/30 
                 overflow-hidden cursor-pointer"
    >
      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-[0.08] 
                      bg-gradient-to-r from-white/20 to-transparent 
                      transition-all pointer-events-none"></div>

      <div className="flex justify-between items-start">
        <div>
          {/* UPDATED LOCATION COLORS */}
          <h3 className="text-xl font-extrabold bg-gradient-to-r 
                         from-black to-black bg-clip-text text-transparent">
            {trip.startLocation} → {trip.endLocation}
          </h3>

          <p className="text-sm text-black mt-2">
            Departure:{" "}
            <span className="font-semibold">
              {new Date(trip.departureTime).toLocaleString()}
            </span>
          </p>

          <p className="text-sm text-black">
            Seats available:{" "}
            <span className="font-extrabold text-green-500">
              {trip.availableSeats}
            </span>
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold text-green-500 mb-3">
            ₹{trip.pricePerSeat}
          </div>

          {/* GLASS BUTTON */}
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              to={`/booking/${trip.tripId}`}
              className="inline-block px-5 py-2 rounded-full font-bold 
                         text-black shadow-md
                         bg-white/30 backdrop-blur-md border border-white/40
                         hover:bg-white/50 hover:shadow-xl
                         transition-all duration-300"
            >
              Book Now
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
