import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import BookingForm from "../Components/BookingForm";
import { motion } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import { getUserReviews } from "../api/reviewApi";
import { FiChevronRight, FiShield, FiCheck, FiInfo } from "react-icons/fi";
import { TbManualGearbox } from "react-icons/tb";

export default function Booking() {
  const { user } = useAuth();
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState("Owner");
  const [ownerAvatar, setOwnerAvatar] = useState(null);
  const [ownerUserId, setOwnerUserId] = useState(null);
  const [ownerPrefs, setOwnerPrefs] = useState([]);
  const [ownerVehicle, setOwnerVehicle] = useState(null);
  const [ownerReviews, setOwnerReviews] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (!tripId) return;
    (async () => {
      try {
        const res = await api.get(`/api/Trip/${tripId}`);
        const data = res.data || {};
        setTrip(data);
        const ownerId =
          data.userId || data.ownerId || data.driverId || data.driverUserId || null;
        if (ownerId) {
          setOwnerUserId(ownerId);
          try {
            const userRes = await api.get(`/auth/me/${ownerId}`);
            const o = userRes.data?.user || userRes.data || {};
            setOwnerName(o.fullName || o.name || "Owner");
            setOwnerAvatar(o.avatarUrl || null);
            const prefs = String(o.travelPreferences || o.travel_preferences || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            setOwnerPrefs(prefs);
            const v = o.vehicle || {};
            setOwnerVehicle({
              make: v.make ?? o.make ?? "",
              model: v.model ?? o.model ?? "",
              year: v.year ?? o.year ?? "",
              color: v.color ?? o.color ?? "",
              licensePlate: v.licensePlate ?? o.licensePlate ?? "",
            });
          } catch (err) {
            console.error("Failed to load owner", err);
            try {
              const fallback = await api.get(`/user/${ownerId}`);
              setOwnerName(fallback.data?.fullName || fallback.data?.name || "Owner");
              setOwnerAvatar(fallback.data?.avatarUrl || null);
            } catch {
              /* ignore */
            }
          }
        } else {
          console.warn("No owner id found on trip object:", data);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load trip");
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  useEffect(() => {
    if (!ownerUserId) return;
    let active = true;
    setReviewsLoading(true);
    getUserReviews(ownerUserId)
      .then((data) => {
        if (active) setOwnerReviews(data);
      })
      .catch(() => {
        if (active) setOwnerReviews(null);
      })
      .finally(() => {
        if (active) setReviewsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [ownerUserId]);

  const handleSuccess = () => {
    navigate("/bookings");
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "--:--";
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

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
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 flex-shrink-0" />
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
              <button
                type="button"
                className="w-full flex items-center justify-between group"
                onClick={() => {
                  if (ownerUserId) navigate(`/owner/${ownerUserId}`);
                }}
              >
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
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <span className="text-yellow-400">★</span>
                      {reviewsLoading ? (
                        <span className="font-semibold text-[#054752]">…</span>
                      ) : ownerReviews && ownerReviews.totalReviews > 0 ? (
                        <>
                          <span className="font-semibold text-[#054752]">
                            {Number(ownerReviews.averageRating).toFixed(1)}/5
                          </span>
                          <span className="text-gray-300 mx-1">·</span>
                          <span>
                            {ownerReviews.totalReviews} rating{ownerReviews.totalReviews > 1 ? "s" : ""}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-[#054752]">No ratings yet</span>
                      )}
                      <span className="text-gray-300 mx-1">·</span>
                      <span className="text-[#00b2e3] font-semibold group-hover:underline">View profile</span>
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
                {ownerPrefs.length > 0 ? (
                  ownerPrefs.map((pref) => (
                    <div key={pref} className="flex items-center gap-3 text-gray-600">
                      <FiCheck className="w-5 h-5 text-[#00b2e3] flex-shrink-0" />
                      <span className="text-sm">{pref}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 text-gray-500">
                    <FiInfo className="w-5 h-5 text-[#00b2e3] flex-shrink-0" />
                    <span className="text-sm">No travel preferences set</span>
                  </div>
                )}
              </div>

              {ownerVehicle && (ownerVehicle.make || ownerVehicle.model) && (
                <div className="mt-5 border-t border-gray-100 pt-5 space-y-3">
                  <div className="flex items-center gap-3 text-gray-500">
                    <TbManualGearbox className="w-5 h-5 text-[#00b2e3] flex-shrink-0" />
                    <span className="text-sm capitalize text-gray-700 font-medium">
                      {[ownerVehicle.make, ownerVehicle.model].filter(Boolean).join(" ")}
                    </span>
                  </div>
                  {(ownerVehicle.year || ownerVehicle.color || ownerVehicle.licensePlate) && (
                    <div className="flex items-center gap-2 text-xs text-gray-400 pl-8">
                      {[ownerVehicle.year, ownerVehicle.color, ownerVehicle.licensePlate]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  )}
                </div>
              )}
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
              ownerId={ownerUserId}
              startLocation={trip.startLocation}
              endLocation={trip.endLocation}
              startAddress={trip.startAddress}
              endAddress={trip.endAddress}
              availableSeats={trip.availableSeats}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
