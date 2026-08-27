import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiCalendar,
  FiMessageCircle,
} from "react-icons/fi";

const STATUS_BADGES = {
  Pending: "bg-[#FFF8E1] text-[#856404]",
  Confirmed: "bg-[#E8F8FE] text-[#054752]",
  Approved: "bg-[#E8F8FE] text-[#054752]",
  Rejected: "bg-[#FDECEC] text-[#8A2A2A]",
  Failed: "bg-[#EFF4F5] text-[#60767B]",
  Scheduled: "bg-[#E8F8FE] text-[#054752]",
  Ongoing: "bg-[#EAF7F0] text-[#1F6A4D]",
  Completed: "bg-[#EFF4F5] text-[#60767B]",
  Cancelled: "bg-[#FDECEC] text-[#8A2A2A]",
};

const BOOKING_STATUS_MAP = {
  0: "Pending",
  1: "Rejected",
  2: "Confirmed",
  3: "Cancelled",
  4: "Failed",
};

const TRIP_STATUS_MAP = {
  0: "Scheduled",
  1: "Ongoing",
  2: "Completed",
  3: "Cancelled",
};

const TRIP_STATUS_TO_ENUM = {
  Scheduled: 0,
  Ongoing: 1,
  Completed: 2,
  Cancelled: 3,
};

const STAT_THEME = {
  blue: { box: "bg-[#E8F8FE]", icon: "text-[#00AFF5]" },
  teal: { box: "bg-[#EAF7F0]", icon: "text-[#1F6A4D]" },
  yellow: { box: "bg-[#FFF8E1]", icon: "text-[#856404]" },
  slate: { box: "bg-[#EFF4F5]", icon: "text-[#60767B]" },
};

const normalizeBookingStatus = (status) => {
  if (status === null || status === undefined) return "Pending";
  if (typeof status === "number") return BOOKING_STATUS_MAP[status] || "Pending";
  const raw = String(status).trim();
  if (raw in BOOKING_STATUS_MAP) return BOOKING_STATUS_MAP[raw];
  const lower = raw.toLowerCase();
  if (lower === "approved" || lower === "confirmed") return "Confirmed";
  if (lower === "rejected") return "Rejected";
  if (lower === "cancelled" || lower === "canceled") return "Cancelled";
  if (lower === "failed") return "Failed";
  if (lower === "pending") return "Pending";
  return raw;
};

const normalizeTripStatus = (status) => {
  if (status === null || status === undefined) return "Scheduled";
  if (typeof status === "number") return TRIP_STATUS_MAP[status] || "Scheduled";
  const raw = String(status).trim();
  if (raw in TRIP_STATUS_MAP) return TRIP_STATUS_MAP[raw];
  const lower = raw.toLowerCase();
  if (lower === "scheduled") return "Scheduled";
  if (lower === "ongoing") return "Ongoing";
  if (lower === "completed") return "Completed";
  if (lower === "cancelled" || lower === "canceled") return "Cancelled";
  return raw;
};

const STAT_ICON_STYLES = {
  blue: "bg-blue-100",
  green: "bg-green-100",
  yellow: "bg-yellow-100",
  purple: "bg-purple-100",
};

const STAT_ICON_COLORS = {
  blue: "text-blue-600",
  green: "text-green-600",
  yellow: "text-yellow-600",
  purple: "text-purple-600",
};

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingActionLoading, setBookingActionLoading] = useState({});

  const loadMyTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/trip/my-trips");
      setTrips(
        (res.data || []).map((trip) => ({
          ...trip,
          status: normalizeTripStatus(trip.status),
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTripBookings = async (tripId) => {
    setLoadingBookings(true);
    try {
      const res = await api.get(`/booking/trip/${tripId}`);
      setBookings(
        (res.data || []).map((booking) => ({
          ...booking,
          status: normalizeBookingStatus(booking.status),
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const updateTripStatus = async (tripId, newStatus) => {
    try {
      const normalizedStatus = normalizeTripStatus(newStatus);
      await api.put(`/api/trip/${tripId}/status`, {
        status: TRIP_STATUS_TO_ENUM[normalizedStatus],
      });
      loadMyTrips();
      if (selectedTrip?.tripId === tripId) {
        setSelectedTrip({ ...selectedTrip, status: normalizedStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const approveBooking = async (bookingId) => {
    setBookingActionLoading((prev) => ({ ...prev, [bookingId]: true }));
    try {
      const res = await api.put(`/booking/${bookingId}/approve`);
      const nextStatus = normalizeBookingStatus(res?.data?.status ?? 2);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.bookingId === bookingId ? { ...booking, status: nextStatus } : booking
        )
      );
      loadMyTrips();
    } catch (err) {
      console.error(err);
    } finally {
      setBookingActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const rejectBooking = async (bookingId) => {
    setBookingActionLoading((prev) => ({ ...prev, [bookingId]: true }));
    try {
      const res = await api.put(`/booking/${bookingId}/reject`);
      const nextStatus = normalizeBookingStatus(res?.data?.status ?? 1);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.bookingId === bookingId ? { ...booking, status: nextStatus } : booking
        )
      );
      loadMyTrips();
    } catch (err) {
      console.error(err);
    } finally {
      setBookingActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleChatWithPassenger = (booking) => {
    localStorage.setItem(
      "preSelectChat",
      JSON.stringify({
        bookingId: booking.bookingId,
        type: "passenger",
        passengerName: booking.passengerName,
        tripId: booking.tripId,
      })
    );
    navigate("/chats");
  };

  useEffect(() => {
    loadMyTrips();
  }, []);

  useEffect(() => {
    if (selectedTrip) loadTripBookings(selectedTrip.tripId);
  }, [selectedTrip]);

  const stats = [
    { icon: FiTrendingUp, label: "Total Trips", value: trips.length, tone: "blue" },
    { icon: FiUsers, label: "Total Bookings", value: bookings.length, tone: "teal" },
    {
      icon: FiCheckCircle,
      label: "Pending",
      value: bookings.filter((b) => normalizeBookingStatus(b.status) === "Pending").length,
      tone: "yellow",
    },
    {
      icon: FiCalendar,
      label: "Scheduled",
      value: trips.filter((t) => normalizeTripStatus(t.status) === "Scheduled").length,
      tone: "slate",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-10 bb-section">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold mb-2 text-[#054752]">My Trips</h1>
          <p>Manage your published rides and approve bookings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bb-card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#054752] mt-1">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl ${
                    STAT_THEME[stat.tone].box
                  } flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${STAT_THEME[stat.tone].icon}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bb-card overflow-hidden">
              <div className="bg-[#054752] p-6">
                <h2 className="text-xl font-bold text-white">Your Trips</h2>
                <p className="text-[#C7E4ED] text-sm mt-1">{trips.length} active trips</p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">Loading trips...</div>
                ) : trips.length === 0 ? (
                  <div className="p-6 text-center">
                    <p>No trips found</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {trips.map((trip) => (
                      <motion.button
                        key={trip.tripId}
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -18 }}
                        onClick={() => setSelectedTrip(trip)}
                        className={`w-full text-left p-4 border-b border-[#e3edf0] hover:bg-[#F2FAFD] transition-colors ${
                          selectedTrip?.tripId === trip.tripId ? "bg-[#eef9fe]" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-[#054752] text-sm">
                            {trip.startLocation} {"->"} {trip.endLocation}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              STATUS_BADGES[normalizeTripStatus(trip.status)] || "bg-[#EFF4F5] text-[#60767B]"
                            }`}
                          >
                            {normalizeTripStatus(trip.status)}
                          </span>
                        </div>
                        <p className="text-xs mb-2">
                          <FiClock className="w-3 h-3 inline mr-1" />
                          {new Date(trip.departureTime).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-semibold text-[#00AFF5]">INR {trip.pricePerSeat}/seat</p>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence>
              {selectedTrip ? (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  className="space-y-6"
                >
                  <div className="bb-card overflow-hidden">
                    <div className="bg-[#054752] p-6 text-white">
                      <h3 className="text-2xl font-bold text-white">Trip Details</h3>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold">From</p>
                          <p className="text-lg font-bold text-[#054752]">{selectedTrip.startLocation}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">To</p>
                          <p className="text-lg font-bold text-[#054752]">{selectedTrip.endLocation}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Date & Time</p>
                          <p className="text-lg font-bold text-[#054752]">
                            {new Date(selectedTrip.departureTime).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Price/Seat</p>
                          <p className="text-lg font-bold text-[#00AFF5]">INR {selectedTrip.pricePerSeat}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Available Seats</p>
                          <p className="text-lg font-bold text-[#054752]">{selectedTrip.availableSeats}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Status</p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              STATUS_BADGES[normalizeTripStatus(selectedTrip.status)] || "bg-[#EFF4F5] text-[#60767B]"
                            }`}
                          >
                            {normalizeTripStatus(selectedTrip.status)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#d6e4e8]">
                        <p className="text-sm font-semibold mb-3">Update Trip Status</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {["Scheduled", "Ongoing", "Completed", "Cancelled"].map((status) => (
                            <motion.button
                              key={status}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => updateTripStatus(selectedTrip.tripId, status)}
                              className={`px-3 py-2 text-sm font-semibold transition-all ${
                                normalizeTripStatus(selectedTrip.status) === status
                                  ? "bg-[#00AFF5] text-white"
                                  : "bg-[#F2FAFD] text-[#054752] hover:bg-[#E8F8FE]"
                              }`}
                            >
                              {status}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bb-card overflow-hidden">
                    <div className="bg-[#054752] p-6 text-white">
                      <h3 className="text-2xl font-bold text-white">Bookings ({bookings.length})</h3>
                    </div>

                    <div className="p-6">
                      {loadingBookings ? (
                        <div className="text-center">Loading bookings...</div>
                      ) : bookings.length === 0 ? (
                        <div className="text-center py-8">No bookings yet for this trip</div>
                      ) : (
                        <div className="space-y-4">
                          <AnimatePresence>
                            {bookings.map((booking) => {
                              const bookingStatus = normalizeBookingStatus(booking.status);
                              const status = bookingStatus.toLowerCase();
                              const isApproved = status === "confirmed";
                              const isRejected = status === "rejected";
                              const isCancelled = status === "cancelled";
                              const disableBoth = isRejected || isCancelled;
                              const disableApprove = disableBoth || isApproved;
                              const disableReject = disableBoth;

                              return (
                                <motion.div
                                  key={booking.bookingId}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                  className="p-4 border border-[#d6e4e8] rounded-2xl bg-white"
                                  style={{ boxShadow: "0 4px 20px rgba(5, 71, 82, 0.08)" }}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <p className="font-bold text-lg text-[#054752]">
                                      {booking.passengerName || "Passenger"}
                                    </p>
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        STATUS_BADGES[bookingStatus] || "bg-[#EFF4F5] text-[#60767B]"
                                      }`}
                                    >
                                      {bookingStatus}
                                    </span>
                                  </div>

                                  <p className="text-sm mb-3">
                                    <strong className="text-[#054752]">Seats:</strong>{" "}
                                    {booking.seatsBooked || booking.numberOfSeats} |{" "}
                                    <strong className="text-[#054752]">Total:</strong> INR {booking.totalAmount}
                                  </p>

                                  <div className="flex gap-2 pt-3 border-t border-[#d6e4e8]">
                                    <motion.button
                                      whileHover={{ scale: 1.03 }}
                                      onClick={() => approveBooking(booking.bookingId)}
                                      disabled={bookingActionLoading[booking.bookingId] || disableApprove}
                                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1F6A4D] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <FiCheckCircle className="w-4 h-4" />
                                      {bookingActionLoading[booking.bookingId] ? "Updating..." : "Approve"}
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.03 }}
                                      onClick={() => rejectBooking(booking.bookingId)}
                                      disabled={bookingActionLoading[booking.bookingId] || disableReject}
                                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#9E2A2A] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <FiXCircle className="w-4 h-4" />
                                      {bookingActionLoading[booking.bookingId] ? "Updating..." : "Reject"}
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.03 }}
                                      onClick={() => handleChatWithPassenger(booking)}
                                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#00AFF5] text-white font-semibold"
                                    >
                                      <FiMessageCircle className="w-4 h-4" />
                                      Chat
                                    </motion.button>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bb-card p-16 text-center"
                >
                  <p className="text-5xl mb-4 text-[#00AFF5]">[ ]</p>
                  <p className="text-xl font-semibold text-[#054752]">Select a trip to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
