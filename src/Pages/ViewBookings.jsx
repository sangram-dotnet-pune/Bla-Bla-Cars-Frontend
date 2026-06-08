import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function ViewBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState({});
  const [userNames, setUserNames] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBookingCard, setSelectedBookingCard] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/booking");
      setBookings(res.data);

      if (res.data && res.data.length > 0) {
        const tripIds = [...new Set(res.data.map((b) => b.tripId).filter(Boolean))];
        const newTripDetails = { ...tripDetails };
        const newUserNames = { ...userNames };

        for (const tripId of tripIds) {
          if (tripId && !newTripDetails[tripId]) {
            try {
              const tripRes = await api.get(`/api/Trip/${tripId}`);
              newTripDetails[tripId] = tripRes.data;

              if (tripRes.data?.ownerId && !newUserNames[tripRes.data.ownerId]) {
                try {
                  const userRes = await api.get(`/user/${tripRes.data.ownerId}`);
                  newUserNames[tripRes.data.ownerId] =
                    userRes.data?.fullName || userRes.data?.name || "Unknown";
                } catch {
                  newUserNames[tripRes.data.ownerId] = "Unknown";
                }
              }
            } catch {
              // skip failed trip
            }
          }
        }
        setTripDetails(newTripDetails);
        setUserNames(newUserNames);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) alert("Please login to view bookings");
      else alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await api.put(`/booking/cancel/${id}`);
      load();
    } catch {
      alert("Failed to cancel");
    }
  };

  const fmt = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const fmtDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
  };

  const statusMeta = (status) => {
    switch (status) {
      case "Confirmed":  return { label: "Confirmed",  dot: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50"  };
      case "Cancelled":  return { label: "Cancelled",  dot: "bg-red-400",    text: "text-red-600",    bg: "bg-red-50"    };
      case "Pending":    return { label: "Pending",    dot: "bg-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50" };
      case "Rejected":   return { label: "Rejected",   dot: "bg-red-400",    text: "text-red-600",    bg: "bg-red-50"    };
      default:           return { label: status || "—", dot: "bg-gray-400",  text: "text-gray-600",   bg: "bg-gray-50"   };
    }
  };

  const filters = ["All", "Pending", "Confirmed", "Cancelled", "Rejected"];

  const filteredBookings =
    statusFilter === "All"
      ? bookings
      : bookings.filter((b) => (b.status || "").toLowerCase() === statusFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Nunito', sans-serif" }}>
            My bookings
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your upcoming and past rides</p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                statusFilter === f
                  ? "bg-[#00b2e3] text-white border-[#00b2e3]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Booking details modal */}
        <AnimatePresence>
          {selectedBookingCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
            >
              <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedBookingCard(null)} />

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Booking details</h3>
                    <p className="text-sm text-gray-500">Details for your booking</p>
                  </div>
                  <button onClick={() => setSelectedBookingCard(null)} className="p-2 rounded-full hover:bg-gray-100">
                    <FiX className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Route</p>
                    <p className="font-semibold text-gray-900">{selectedBookingCard.startLocation || tripDetails[selectedBookingCard.tripId]?.startLocation || '—'} → {selectedBookingCard.endLocation || tripDetails[selectedBookingCard.tripId]?.endLocation || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Driver</p>
                    <p className="font-semibold text-gray-900">{userNames[tripDetails[selectedBookingCard.tripId]?.ownerId] || selectedBookingCard.tripOwnerName || 'Driver'}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Departure</p>
                    <p className="font-semibold text-gray-900">{fmt(selectedBookingCard.departureTime || tripDetails[selectedBookingCard.tripId]?.departureTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Seats</p>
                    <p className="font-semibold text-gray-900">{selectedBookingCard.seatsBooked} seat{selectedBookingCard.seatsBooked > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setSelectedBookingCard(null)}
                    className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      try {
                        localStorage.setItem('preSelectChat', JSON.stringify({ type: 'driver', bookingId: selectedBookingCard.bookingId, tripId: selectedBookingCard.tripId }));
                        navigate('/chats');
                      } catch (err) {
                        console.error('Failed to open chat', err);
                        navigate('/chats');
                      }
                    }}
                    className="px-4 py-2 bg-[#00b2e3] text-white rounded-full text-sm font-semibold hover:bg-[#009fcd] transition-colors"
                  >
                    Chat with owner
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center pt-16">
            <svg className="animate-spin w-8 h-8 text-[#00b2e3]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-200 p-12 text-center"
          >
            <div className="text-4xl mb-3">🚗</div>
            <p className="text-gray-500 font-medium">
              {statusFilter === "All" ? "No bookings yet." : `No ${statusFilter.toLowerCase()} bookings.`}
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-5 py-2 bg-[#00b2e3] text-white rounded-full text-sm font-semibold hover:bg-[#009fcd] transition-colors"
            >
              Find a ride
            </button>
          </motion.div>
        )}

        {/* Booking Cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredBookings.map((b, i) => {
              const trip = tripDetails[b.tripId];
              const ownerName = userNames[trip?.ownerId] || b.tripOwnerName || b.driverName || b.ownerName || "Driver";
              const start = b.startLocation || trip?.startLocation || "—";
              const end   = b.endLocation   || trip?.endLocation   || "—";
              const depTime = b.departureTime || trip?.departureTime;
              const arrTime = b.arrivalTime   || trip?.arrivalTime;
              const sm = statusMeta(b.status);

              return (
                <motion.div
                  key={b.bookingId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onClick={() => setSelectedBookingCard(b)}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Top: date + status */}
                  <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-500">{fmtDate(depTime)}</p>
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${sm.bg} ${sm.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                      {sm.label}
                    </span>
                  </div>

                  {/* Route timeline */}
                  <div className="px-6 py-5 flex gap-6 border-b border-gray-100">
                    {/* Times */}
                    <div className="flex flex-col justify-between text-right w-12 flex-shrink-0 py-0.5">
                      <span className="text-base font-bold text-gray-900">{fmt(depTime)}</span>
                      <span className="text-base font-bold text-gray-900">{fmt(arrTime)}</span>
                    </div>

                    {/* Dot-line */}
                    <div className="flex flex-col items-center flex-shrink-0 py-1">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-white" />
                      <div className="w-px flex-1 bg-gray-300 my-1" style={{ minHeight: "28px" }} />
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-white" />
                    </div>

                    {/* Locations */}
                    <div className="flex flex-col justify-between flex-1 py-0.5">
                      <p className="text-base font-bold text-gray-900">{start}</p>
                      <p className="text-base font-bold text-gray-900">{end}</p>
                    </div>

                    {/* Price */}
                    <div className="flex-shrink-0 text-right self-center">
                      <p className="text-xl font-extrabold text-gray-900">₹{b.totalAmount}</p>
                      <p className="text-xs text-gray-400">{b.seatsBooked} seat{b.seatsBooked > 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  {/* Driver row + actions */}
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    {/* Driver info */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">
                        {ownerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{ownerName}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <span className="text-yellow-400">★</span>
                          <span>5</span>
                        </div>
                      </div>
                    </div>

                    {/* Cancel button — only if not already cancelled/rejected */}
                    {b.status !== "Cancelled" && b.status !== "Rejected" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCancel(b.bookingId); }}
                        className="px-4 py-2 rounded-full border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
                      >
                        Cancel booking
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}