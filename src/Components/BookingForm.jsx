import { useEffect, useRef, useState } from "react";
import api from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiShield, FiZap } from "react-icons/fi";

export default function BookingForm({
  tripId,
  passengerName,
  passengerId,
  driverName,
  pricePerSeat,
  onSuccess,
  departureTime,
  ownerName,
  ownerAvatar,
  startLocation,
  endLocation,
  startAddress,
  endAddress,
  arrivalTime,
  availableSeats,
}) {
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const redirectTimer = useRef(null);
  const seatsLeft = Number(availableSeats);
  const hasSeatsLimit = Number.isFinite(seatsLeft);
  const isFull = hasSeatsLimit && seatsLeft <= 0;
  const maxSelectableSeats = hasSeatsLimit ? Math.max(1, Math.min(10, seatsLeft)) : 10;

  const total = (seats || 0) * (pricePerSeat || 0);

  // Format time HH:MM
  const fmt = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  // Format date like "Saturday, 21 February"
  const fmtDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  };

  const getErrorMessage = (err) => {
    const apiError = err?.response?.data;
    if (typeof apiError === "string" && apiError.trim()) return apiError;
    if (apiError?.message) return apiError.message;
    return "Booking failed. Please try again.";
  };

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (hasSeatsLimit && seatsLeft > 0 && seats > seatsLeft) {
      setSeats(seatsLeft);
    }
  }, [hasSeatsLimit, seatsLeft, seats]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFull) {
      setStatus({
        type: "error",
        message: "This ride is full.",
      });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const payload = {
        tripId,
        passengerId,
        passengerName,
        seatsBooked: Number(seats),

      };
      const res = await api.post("/booking", payload);
      setStatus({
        type: "success",
        message: "Booking confirmed. Redirecting to your bookings...",
      });
      redirectTimer.current = setTimeout(() => {
        onSuccess?.(res.data);
      }, 900);
      setLoading(false);
    } catch (err) {
      console.error("Booking failed", err);
      setStatus({
        type: "error",
        message: getErrorMessage(err),
      });
      setLoading(false);
    }
  };

  // Whole-number and decimal parts for price display
  const totalWhole = Math.floor(total);
  const totalDecimal = (total % 1).toFixed(2).slice(1); // ".00"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12 }}
      className="sticky top-24 space-y-3"
    >
      {/* ── Main Card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`mx-5 mt-5 mb-1 rounded-xl border px-3.5 py-3 text-sm font-semibold flex items-start gap-2 ${
                status.type === "success"
                  ? "border-[#bfefff] bg-[#e9f9ff] text-[#045b70]"
                  : "border-[#ffd7d7] bg-[#fff2f2] text-[#a33a3a]"
              }`}
            >
              {status.type === "success" ? (
                <FiCheckCircle className="w-4.5 h-4.5 mt-0.5 shrink-0 text-[#00b2e3]" />
              ) : (
                <FiAlertCircle className="w-4.5 h-4.5 mt-0.5 shrink-0 text-[#e05252]" />
              )}
              <span>{status.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Date Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <p className="text-base font-bold text-gray-900">{fmtDate(departureTime)}</p>
        </div>

        {/* Mini Route Timeline */}
        <div className="px-5 py-4 border-b border-gray-100">
          {/* Departure */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-white" />
              <div className="w-px flex-1 bg-gray-300 my-1" style={{ minHeight: "28px" }} />
            </div>
            <div className="pb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-gray-900">{fmt(departureTime)}</span>
                <span className="text-sm font-bold text-gray-900">{startLocation}</span>
              </div>
              {startAddress && (
                <p className="text-xs text-gray-400 mt-0.5 leading-tight line-clamp-2">{startAddress}</p>
              )}
            </div>
          </div>

          {/* Arrival */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-gray-900">{fmt(arrivalTime)}</span>
                <span className="text-sm font-bold text-gray-900">{endLocation}</span>
              </div>
              {endAddress && (
                <p className="text-xs text-gray-400 mt-0.5 leading-tight line-clamp-2">{endAddress}</p>
              )}
            </div>
          </div>
        </div>

        {/* Driver mini row */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          {/* Car icon placeholder */}
          <div className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {ownerAvatar ? (
              <img src={ownerAvatar} alt={driverName} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold border-2 border-white shadow">
                {driverName || "?"}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00b2e3] rounded-full flex items-center justify-center">
              <FiShield className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">{ownerName}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className="text-yellow-400">★</span>
              <span>5</span>
            </div>
          </div>
        </div>

        {/* Passenger count & price */}
        <form onSubmit={handleSubmit}>
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {/* Seats selector */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 font-medium">Passengers</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSeats((s) => Math.max(1, Number(s) - 1))}
                    disabled={isFull}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500 transition-colors text-lg leading-none disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold text-gray-900 w-4 text-center">{seats}</span>
                  <button
                    type="button"
                    onClick={() => setSeats((s) => Math.min(maxSelectableSeats, Number(s) + 1))}
                    disabled={isFull || seats >= maxSelectableSeats}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500 transition-colors text-lg leading-none disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Animated price */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={total}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-baseline"
                >
                  <span className="text-xl font-extrabold text-gray-900">₹{totalWhole}</span>
                  <span className="text-sm font-bold text-gray-500">{totalDecimal}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Book button */}
          <div className="px-5 py-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading || isFull}
              className="w-full bg-[#00b2e3] hover:bg-[#009fcd] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : isFull ? (
                "Full"
              ) : (
                <>
                  <FiZap className="w-4 h-4" />
                  Book
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      {/* Fine print */}
      <p className="text-xs text-gray-400 text-center px-2">
        By clicking Book, you agree to our terms and conditions.
      </p>
    </motion.div>
  );
}
