import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiClock, FiUsers, FiChevronDown, FiCheckCircle, FiXCircle, FiTrendingUp, FiCalendar, FiMessageCircle } from "react-icons/fi";

const STATUS_COLORS = {
  Pending: "bg-yellow-50 border-yellow-200 text-yellow-700",
  Scheduled: "bg-blue-50 border-blue-200 text-blue-700",
  Ongoing: "bg-green-50 border-green-200 text-green-700",
  Completed: "bg-gray-50 border-gray-200 text-gray-700",
  Cancelled: "bg-red-50 border-red-200 text-red-700",
};

const STATUS_BADGES = {
  Pending: "bg-yellow-100 text-yellow-800",
  Scheduled: "bg-blue-100 text-blue-800",
  Ongoing: "bg-green-100 text-green-800",
  Completed: "bg-gray-100 text-gray-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function MyTrips() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const loadMyTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/trip/my-trips");
      setTrips(res.data);
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
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const updateTripStatus = async (tripId, newStatus) => {
    try {
      await api.put(`/api/trip/${tripId}/status`, { status: newStatus });
      loadMyTrips();
      if (selectedTrip?.tripId === tripId) {
        setSelectedTrip({ ...selectedTrip, status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const approveBooking = async (bookingId) => {
    try {
      await api.put(`/booking/${bookingId}/approve`);
      loadTripBookings(selectedTrip.tripId);
      loadMyTrips();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      await api.put(`/booking/${bookingId}/reject`);
      loadTripBookings(selectedTrip.tripId);
      loadMyTrips();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChatWithPassenger = (booking) => {
    // Save the chat info to localStorage and navigate
    localStorage.setItem("preSelectChat", JSON.stringify({
      bookingId: booking.bookingId,
      type: "passenger",
      passengerName: booking.passengerName,
      tripId: booking.tripId
    }));
    navigate("/chats");
  };

  useEffect(() => {
    loadMyTrips();
  }, []);

  useEffect(() => {
    if (selectedTrip) {
      loadTripBookings(selectedTrip.tripId);
    }
  }, [selectedTrip]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Trips</h1>
          <p className="text-gray-600">Manage your published rides and approve bookings</p>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: FiTrendingUp, label: "Total Trips", value: trips.length, color: "blue" },
            { icon: FiUsers, label: "Total Bookings", value: bookings.length, color: "green" },
            { icon: FiCheckCircle, label: "Pending", value: bookings.filter(b => b.status === "Pending").length, color: "yellow" },
            { icon: FiCalendar, label: "Scheduled", value: trips.filter(t => t.status === "Scheduled").length, color: "purple" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* TRIPS LIST */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <h2 className="text-xl font-bold text-white">Your Trips</h2>
                <p className="text-blue-100 text-sm mt-1">{trips.length} active trips</p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center text-gray-500">Loading trips...</div>
                ) : trips.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>No trips found</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {trips.map((trip, i) => (
                      <motion.button
                        key={trip.tripId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={() => setSelectedTrip(trip)}
                        className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          selectedTrip?.tripId === trip.tripId ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-sm">
                            {trip.startLocation} → {trip.endLocation}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGES[trip.status]}`}>
                            {trip.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          <FiClock className="w-3 h-3 inline mr-1" />
                          {new Date(trip.departureTime).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-semibold text-blue-600">₹{trip.pricePerSeat}/seat</p>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>

          {/* TRIP DETAILS & BOOKINGS */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {selectedTrip ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-6"
                >
                  {/* TRIP DETAILS CARD */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                      <h3 className="text-2xl font-bold">Trip Details</h3>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">From</p>
                          <p className="text-lg font-bold text-gray-900">{selectedTrip.startLocation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">To</p>
                          <p className="text-lg font-bold text-gray-900">{selectedTrip.endLocation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Date & Time</p>
                          <p className="text-lg font-bold text-gray-900">{new Date(selectedTrip.departureTime).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Price/Seat</p>
                          <p className="text-lg font-bold text-green-600">₹{selectedTrip.pricePerSeat}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Available Seats</p>
                          <p className="text-lg font-bold text-blue-600">{selectedTrip.availableSeats}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${STATUS_BADGES[selectedTrip.status]}`}>
                            {selectedTrip.status}
                          </span>
                        </div>
                      </div>

                      {/* STATUS UPDATE */}
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Update Trip Status</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {["Pending", "Scheduled", "Ongoing", "Completed", "Cancelled"].map((status) => (
                            <motion.button
                              key={status}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateTripStatus(selectedTrip.tripId, status)}
                              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                                selectedTrip.status === status
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {status}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOOKINGS CARD */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                      <h3 className="text-2xl font-bold">Bookings ({bookings.length})</h3>
                    </div>

                    <div className="p-6">
                      {loadingBookings ? (
                        <div className="text-center text-gray-500">Loading bookings...</div>
                      ) : bookings.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No bookings yet for this trip
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <AnimatePresence>
                            {bookings.map((booking, i) => (
                              <motion.div
                                key={booking.bookingId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <p className="font-bold text-lg text-gray-900">{booking.passengerName || "Passenger"}</p>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BADGES[booking.status]}`}>
                                    {booking.status}
                                  </span>
                                </div>

                                <p className="text-sm text-gray-700 mb-3">
                                  <strong>Seats:</strong> {booking.seatsBooked || booking.numberOfSeats} | <strong>Total:</strong> ₹{booking.totalAmount}
                                </p>

                                <div className="flex gap-2 pt-3 border-t border-gray-200">
                                  {booking.status === "Pending" && (
                                    <>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => approveBooking(booking.bookingId)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                      >
                                        <FiCheckCircle className="w-4 h-4" />
                                        Approve
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => rejectBooking(booking.bookingId)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                      >
                                        <FiXCircle className="w-4 h-4" />
                                        Reject
                                      </motion.button>
                                    </>
                                  )}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => handleChatWithPassenger(booking)}
                                    className={`${booking.status === "Pending" ? "flex-1" : "w-full"} flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors`}
                                  >
                                    <FiMessageCircle className="w-4 h-4" />
                                    Chat with {booking.passengerName || "Passenger"}
                                  </motion.button>
                                </div>
                              </motion.div>
                            ))}
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
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center"
                >
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-xl text-gray-600 font-semibold">Select a trip to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}