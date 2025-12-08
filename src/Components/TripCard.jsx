import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiClock, FiUsers, FiStar, FiChevronRight } from "react-icons/fi";

export default function TripCard({ trip }) {
  const formattedDate = new Date(trip.departureTime).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = new Date(trip.departureTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const estimatedDuration = Math.floor(Math.random() * 2) + 2; // 2-3 hours (demo)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.3 }}
      className="h-full rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* TOP ACCENT BAR */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>

      <div className="p-6 space-y-5">

        {/* ROUTE SECTION */}
        <div className="space-y-4">
          {/* From Location */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <FiMapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">From</p>
              <p className="text-lg font-bold text-gray-900 truncate">{trip.startLocation}</p>
            </div>
          </div>

          {/* Duration Indicator */}
          <div className="flex items-center gap-2 pl-5">
            <div className="flex-1 h-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full"></div>
            <span className="text-xs text-gray-500 font-semibold whitespace-nowrap">
              <FiClock className="w-4 h-4 inline mr-1" />
              {estimatedDuration}h
            </span>
          </div>

          {/* To Location */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
              <FiMapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">To</p>
              <p className="text-lg font-bold text-gray-900 truncate">{trip.endLocation}</p>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-gray-200"></div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 gap-4">
          {/* Date & Time */}
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
              <FiClock className="w-3 h-3 inline mr-1" />
              Date & Time
            </p>
            <p className="text-sm font-bold text-gray-900">{formattedDate}</p>
            <p className="text-sm text-blue-600 font-semibold">{formattedTime}</p>
          </div>

          {/* Available Seats */}
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
              <FiUsers className="w-3 h-3 inline mr-1" />
              Seats Available
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-green-600">{trip.availableSeats}</p>
              <span className="text-xs text-gray-500">seats</span>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-gray-200"></div>

        {/* PRICE & BUTTON */}
        <div className="flex items-end justify-between pt-2">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
              <FiStar className="w-3 h-3 inline mr-1" />
              Price per Seat
            </p>
            <p className="text-3xl font-extrabold text-blue-600">
              ₹<span>{trip.pricePerSeat}</span>
            </p>
          </div>

          <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`/booking/${trip.tripId}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Book Now
              <FiChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
