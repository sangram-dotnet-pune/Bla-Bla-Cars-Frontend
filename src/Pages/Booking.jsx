import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import BookingForm from "../Components/BookingForm";
import { motion } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import { FiChevronRight, FiZap, FiSlash, FiHeart, FiShield } from "react-icons/fi";
import { MdOutlinePets } from "react-icons/md";
import { TbManualGearbox } from "react-icons/tb";

export default function Booking() {
  const { user } = useAuth();
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState("Owner");
  const [ownerAvatar, setOwnerAvatar] = useState(null);

  useEffect(() => {
    if (!tripId) return;
    (async () => {
      try {
        const res = await api.get(`/api/Trip/${tripId}`);
        setTrip(res.data);
        if (res.data?.ownerId) {
          try {
            const userRes = await api.get(`/user/${res.data.ownerId}`);
            setOwnerName(userRes.data?.fullName || userRes.data?.name || "Owner");
            setOwnerAvatar(userRes.data?.avatarUrl || null);
          } catch (err) {
            console.error("Failed to load owner", err);
          }
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load trip");
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  const handleSuccess = () => {
    navigate("/bookings");
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "--:--";
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const duration = trip?.durationMinutes
    ? `${Math.floor(trip.durationMinutes / 60)}h${trip.durationMinutes % 60 > 0 ? ` ${trip.durationMinutes % 60}m` : ""}`
    : trip?.estimatedDuration || "2h 10m";

  if (loading)
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center pt-24">
        <div className="text-center">
          <svg className="animate-spin w-10 h-10 text-[#00b2e3] mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-gray-500 text-sm">Loading ride details...</p>
        </div>
      </div>
    );

  if (!trip)
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center pt-24">
        <p className="text-gray-500">Trip not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-6"
        >
          Ride details
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-4">
            {/* Route Timeline Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <div className="flex gap-4">
                <div className="w-14 text-right flex-shrink-0">
                  <span className="text-lg font-bold text-gray-900">{formatTime(trip.departureTime)}</span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full border-2 border-gray-400 bg-white mt-1.5" />
                  <div className="flex-1 w-px bg-gray-300 my-1" style={{ minHeight: "40px" }} />
                </div>
                <div className="pb-6">
                  <p className="text-lg font-bold text-gray-900 leading-tight">{trip.startLocation}</p>
                  {trip.startAddress && <p className="text-sm text-gray-500 mt-0.5">{trip.startAddress}</p>}
                  <span className="inline-block mt-1 text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">{duration}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-14 text-right flex-shrink-0">
                  <span className="text-lg font-bold text-gray-900">{trip.arrivalTime ? formatTime(trip.arrivalTime) : "—"}</span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full border-2 border-gray-400 bg-white mt-1.5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 leading-tight">{trip.endLocation}</p>
                  {trip.endAddress && <p className="text-sm text-gray-500 mt-0.5">{trip.endAddress}</p>}
                </div>
              </div>
            </motion.div>

            {/* Driver Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <button className="w-full flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {ownerAvatar ? (
                      <img src={ownerAvatar} alt={trip.driverName} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                        {ownerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00b2e3] rounded-full flex items-center justify-center">
                      <FiShield className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-gray-900">{trip.driverName}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span className="text-yellow-400">★</span>
                      <span>5/5</span>
                      <span className="text-gray-300 mx-1">·</span>
                      <span>12 ratings</span>
                    </div>
                  </div>
                </div>
                <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>

              <div className="mt-5 border-t border-gray-100 pt-5 space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <FiShield className="w-5 h-5 text-[#00b2e3] flex-shrink-0" />
                  <span className="text-sm">Verified Profile</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FiHeart className="w-5 h-5 text-[#00b2e3] flex-shrink-0" />
                  <span className="text-sm">Rarely cancels rides</span>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-5 space-y-3">
                <div className="flex items-center gap-3 text-gray-500">
                  <FiZap className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Your booking will be confirmed instantly</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <FiSlash className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">No smoking, please</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <MdOutlinePets className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">I'd prefer not to travel with pets</span>
                </div>
                {trip.vehicleInfo && (
                  <div className="flex items-center gap-3 text-gray-500">
                    <TbManualGearbox className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm uppercase tracking-wide text-gray-400 font-medium">{trip.vehicleInfo}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <BookingForm
              tripId={trip.tripId}
              passengerId={user?.userId || ""}
              passengerName={user?.fullName || ""}
              pricePerSeat={trip.pricePerSeat}
              departureTime={trip.departureTime}
              ownerName={trip.driverName}
              ownerAvatar={ownerAvatar}
              startLocation={trip.startLocation}
              endLocation={trip.endLocation}
              startAddress={trip.startAddress}
              endAddress={trip.endAddress}
              arrivalTime={trip.arrivalTime}
              availableSeats={trip.availableSeats}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
