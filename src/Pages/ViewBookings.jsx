import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle } from "react-icons/fi";

export default function ViewBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState({});
  const [userNames, setUserNames] = useState({});
  const [tripLoadError, setTripLoadError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/booking");
      setBookings(res.data);
      
      // Fetch trip details for all bookings to get driver names
      if (res.data && res.data.length > 0) {
        const tripIds = [...new Set(res.data.map((b) => b.tripId).filter((id) => id))];
        const newTripDetails = { ...tripDetails };
        const newUserNames = { ...userNames };

        for (const tripId of tripIds) {
          if (tripId && !newTripDetails[tripId]) {
            try {
              const tripRes = await api.get(`/api/Trip/${tripId}`);
              newTripDetails[tripId] = tripRes.data;

              // Fetch owner name if we have ownerId
              if (tripRes.data?.ownerId && !newUserNames[tripRes.data.ownerId]) {
                try {
                  const userRes = await api.get(`/user/${tripRes.data.ownerId}`);
                  newUserNames[tripRes.data.ownerId] = userRes.data?.fullName || userRes.data?.name || "Unknown";
                } catch (err) {
                  console.error(`Failed to load user ${tripRes.data.ownerId}`, err);
                  newUserNames[tripRes.data.ownerId] = "Unknown";
                }
              }
            } catch (err) {
              console.error(`Failed to load trip ${tripId}`, err);
            }
          }
        }
        setTripDetails(newTripDetails);
        setUserNames(newUserNames);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Please login to view bookings");
      } else {
        alert("Failed to load bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Cancel booking?")) return;
    try {
      await api.put(`/booking/cancel/${id}`);
      alert("Cancelled");
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "text-green-600 font-bold";
      case "Cancelled":
        return "text-red-600 font-bold";
      default:
        return "text-blue-600 font-bold";
    }
  };

  const filteredBookings =
    statusFilter === "All"
      ? bookings
      : bookings.filter(
          (b) => (b.status || "").toLowerCase() === statusFilter.toLowerCase()
        );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      {/* CONTENT */}
      <motion.div
        className="container mx-auto p-6 min-h-screen pt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Bookings
            </h1>
            <p className="text-gray-600 text-sm">Manage your ride bookings</p>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="appearance-none bg-white border-2 border-gray-300 text-gray-900 rounded-xl px-5 py-3 pr-10 font-semibold shadow-md hover:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer min-w-[180px]"
            >
              <option value="All">📋 All Bookings</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Confirmed">✅ Confirmed</option>
              <option value="Rejected">❌ Rejected</option>
              <option value="Cancelled">🚫 Cancelled</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-[38px] text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-300"
          >
            Loading…
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white"
          >
            {statusFilter === "All" ? "No bookings found." : `No ${statusFilter.toLowerCase()} bookings found.`}
          </motion.div>
        )}

        {/* BOOKINGS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBookings.map((b, i) => (
              <motion.div
                key={b.bookingId}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                  b.status === "Confirmed" ? "bg-green-100 text-green-700" :
                  b.status === "Cancelled" ? "bg-red-100 text-red-700" :
                  b.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {b.status}
                </div>

                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                  <h3 className="text-xl font-bold truncate">{b.passengerName}</h3>
                  <p className="text-sm text-blue-100">
                    {b.startLocation || tripDetails[b.tripId]?.startLocation || "Unknown"} → {b.endLocation || tripDetails[b.tripId]?.endLocation || "Unknown"}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Trip Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Seats</p>
                      <p className="text-xl font-bold text-blue-600">{b.seatsBooked}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total</p>
                      <p className="text-xl font-bold text-green-600">₹{b.totalAmount}</p>
                    </div>
                  </div>

                  {/* Departure Info */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Departure Time</p>
                    <p className="text-sm text-gray-900">
                      {b.departureTime
                        ? new Date(b.departureTime).toLocaleString()
                        : tripDetails[b.tripId]?.departureTime
                        ? new Date(tripDetails[b.tripId].departureTime).toLocaleString()
                        : "Not specified"}
                    </p>
                  </div>

                  {/* Owner Info */}
                  <div className="flex items-center gap-2 text-sm bg-purple-50 rounded-lg p-3">
                    <span className="font-semibold text-gray-700">Owner:</span>
                    <span className="text-gray-900 font-semibold">{userNames[tripDetails[b.tripId]?.ownerId] || b.tripOwnerName || b.driverName || b.ownerName || "Unknown"}</span>
                  </div>

                  {tripLoadError && <div className="text-red-600 text-xs">{tripLoadError}</div>}
                </div>

                {/* Card Footer - Actions */}
                {b.status !== "Cancelled" && (
                  <div className="border-t border-gray-100 p-4 space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      // --- FIX APPLIED HERE ---
                      onClick={() => {
                        // 1. Prepare data for pre-selection in Chats.jsx
                        const preSelectData = {
                          tripId: b.tripId,
                          bookingId: b.bookingId, // <--- Crucial fix: Pass bookingId
                          type: "driver",
                          ownerName: userNames[tripDetails[b.tripId]?.ownerId] || "Driver"
                        };
                        localStorage.setItem("preSelectChat", JSON.stringify(preSelectData));
                        
                        // 2. Update the persistent activeChats list to keep the conversation after a refresh
                        const convId = `booking-${b.bookingId}`;
                        const savedChats = localStorage.getItem("activeChats");
                        const activeConversationIds = savedChats ? JSON.parse(savedChats) : [];
                        
                        if (!activeConversationIds.includes(convId)) {
                            activeConversationIds.push(convId);
                            localStorage.setItem("activeChats", JSON.stringify(activeConversationIds));
                        }
                        
                        // 3. Navigate to the chats page
                        navigate("/chats");
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <FiMessageCircle className="w-4 h-4" />
                      Chat with Owner
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCancel(b.bookingId)}
                      className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
                    >
                      ❌ Cancel Booking
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}