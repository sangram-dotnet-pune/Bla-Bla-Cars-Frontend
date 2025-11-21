import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function TripCard({ trip }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Glass UI Card styling
      whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.3 }}
      className="relative rounded-xl p-5 shadow-lg bg-white/60 backdrop-blur-md border border-white/50 overflow-hidden cursor-pointer"
    >
      {/* Shine effect (Adjusted opacity to be more subtle with Glass) */}
      <div className="absolute inset-0 w-full h-full opacity-0 hover:opacity-[0.05] bg-gradient-to-r from-white/10 to-transparent pointer-events-none transition-all"></div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-blue-600">
            {trip.startLocation} → {trip.endLocation}
          </h3>

          <p className="text-sm text-black mt-2">
            Departure: <span className="font-semibold">{new Date(trip.departureTime).toLocaleString()}</span>
          </p>

          <p className="text-sm text-black">
            Seats available:{" "}
            <span className="font-extrabold text-yellow-400">{trip.availableSeats}</span>
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold text-green-700 mb-2">₹{trip.pricePerSeat}</div>

          <motion.div whileHover={{ scale: 1.07 }}>
            <Link
              to={`/booking/${trip.tripId}`}
              className="mt-2 inline-block bg-blue-600 text-white font-semibold px-4 py-2 rounded-full transition hover:bg-blue-700 shadow-md" // Primary Button
            >
              Book Now
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}