import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import { FiStar, FiZap, FiUsers } from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";

export default function TripCard({ trip, onAuthRequired }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = Boolean(user?.userId || user?.id || user?.email);

  const date = new Date(trip.departureTime);
  const seatsAvailable = Number(trip.availableSeats);
  const hasSeatsValue = Number.isFinite(seatsAvailable);
  const isFull = hasSeatsValue && seatsAvailable <= 0;

  const handleCardClick = () => {
    if (!isLoggedIn) {
      onAuthRequired?.();
    } else {
      navigate(`/booking/${trip.tripId}`);
    }
  };

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });



  const driverName = trip.driverName || "Driver";
  const driverRating = trip.driverRating || null;
  const driverAvatar = trip.driverAvatar || null;
  const instantBooking = trip.instantBooking || false;
  const showSeatsMeta = hasSeatsValue;
  const showMetaDivider = instantBooking || showSeatsMeta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isFull ? { y: -2, boxShadow: "0 8px 32px rgba(5,71,82,0.13)" } : undefined}
      transition={{ duration: 0.25 }}
    >
      {isFull ? (
        <div className="block no-underline pointer-events-none">
          <div className="bg-white rounded-2xl border border-[#e4eef1] overflow-hidden cursor-not-allowed opacity-80 transition-all duration-200">
            <div className="flex items-center justify-between px-6 pt-5 pb-4">

              {/* Left: departure time + city */}
              <div className="min-w-[72px]">
                <p className="text-[22px] font-extrabold text-[#0d2b36] leading-none">{formattedTime}</p>
                <p className="text-[14px] font-semibold text-[#0d2b36] mt-1">{trip.startLocation}</p>
              </div>

              {/* Center: route line */}
              <div className="flex-1 flex flex-col items-center px-4">
                <div className="flex items-center w-full gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-[#6b8fa0] bg-white shrink-0" />
                  <div className="flex-1 h-[2px] bg-[#6b8fa0]" />
                
                  <div className="flex-1 h-[2px] bg-[#6b8fa0]" />
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-[#6b8fa0] bg-[#6b8fa0] shrink-0" />
                </div>
              </div>

              {/* Right: arrival time + city */}
              <div className="min-w-[72px] text-right">
                <p className="text-[14px] font-semibold text-[#0d2b36] mt-1">{trip.endLocation}</p>
              </div>

              {/* Price — far right */}
              <div className="ml-8 text-right shrink-0">
                <p className="text-[26px] font-extrabold text-[#0d2b36] leading-none">
                  ₹<span>{trip.pricePerSeat}</span>
                  <span className="text-[14px] font-semibold text-[#6b8fa0]">.00</span>
                </p>
              </div>
            </div>

            <div className="h-px bg-[#eaf1f4] mx-6" />

            <div className="flex items-center gap-4 px-6 py-3.5">
              <MdDirectionsCar className="w-8 h-8 text-[#6b8fa0] shrink-0" />

              <div className="relative shrink-0">
                {driverAvatar ? (
                  <img
                    src={driverAvatar}
                    alt={driverName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#00AFF5] flex items-center justify-center text-white font-bold text-base border-2 border-white shadow">
                    {driverName.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00AFF5] rounded-full flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <span className="text-[15px] font-semibold text-[#0d2b36]">{driverName}</span>
              {driverRating && (
                <span className="flex items-center gap-1 text-[14px] font-semibold text-[#0d2b36]">
                  <FiStar className="w-3.5 h-3.5 fill-[#0d2b36] text-[#0d2b36]" />
                  {driverRating}
                </span>
              )}

              {showMetaDivider && (
                <span className="text-[#c5d8dc] text-lg leading-none">|</span>
              )}

              {instantBooking && (
                <span className="flex items-center gap-1 text-[14px] font-semibold text-[#0d2b36]">
                  <FiZap className="w-4 h-4 text-[#0d2b36]" />
                  Instant Booking
                </span>
              )}

              {showSeatsMeta && (
                <span className={`flex items-center gap-1.5 text-[14px] font-semibold ${isFull ? "text-[#e05252]" : "text-[#0d2b36]"}`}>
                  <FiUsers className="w-4 h-4" />
                  {isFull ? "Full" : `Max. ${seatsAvailable}`}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
      <div role="button" tabIndex={0} onClick={handleCardClick} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCardClick()} className="block no-underline cursor-pointer">
        <div className="bg-white rounded-2xl border border-[#e4eef1] overflow-hidden cursor-pointer transition-all duration-200">

         
          <div className="flex items-center justify-between px-6 pt-5 pb-4">

            {/* Left: departure time + city */}
            <div className="min-w-[72px]">
              <p className="text-[22px] font-extrabold text-[#0d2b36] leading-none">{formattedTime}</p>
              <p className="text-[14px] font-semibold text-[#0d2b36] mt-1">{trip.startLocation}</p>
            </div>

            {/* Center: route line */}
            <div className="flex-1 flex flex-col items-center px-4">
              <div className="flex items-center w-full gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#6b8fa0] bg-white shrink-0" />
                <div className="flex-1 h-[2px] bg-[#6b8fa0]" />
                <div className="flex-1 h-[2px] bg-[#6b8fa0]" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#6b8fa0] bg-[#6b8fa0] shrink-0" />
              </div>
            </div>

            {/* Right: arrival time + city */}
            <div className="min-w-[72px] text-right">
        
              <p className="text-[14px] font-semibold text-[#0d2b36] mt-1">{trip.endLocation}</p>
            </div>

            {/* Price — far right */}
            <div className="ml-8 text-right shrink-0">
              <p className="text-[26px] font-extrabold text-[#0d2b36] leading-none">
                ₹<span>{trip.pricePerSeat}</span>
                <span className="text-[14px] font-semibold text-[#6b8fa0]">.00</span>
              </p>
            </div>
          </div>

          {/* ── Divider ──────────────────────────────────────────────────── */}
          <div className="h-px bg-[#eaf1f4] mx-6" />

          {/* ── Row 2: Driver info + badges ──────────────────────────────── */}
          <div className="flex items-center gap-4 px-6 py-3.5">

            {/* Car icon */}
            <MdDirectionsCar className="w-8 h-8 text-[#6b8fa0] shrink-0" />

            {/* Avatar */}
            <div className="relative shrink-0">
              {driverAvatar ? (
                <img
                  src={driverAvatar}
                  alt={driverName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#00AFF5] flex items-center justify-center text-white font-bold text-base border-2 border-white shadow">
                  {driverName.charAt(0)}
                </div>
              )}
              {/* Verified badge */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00AFF5] rounded-full flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Name + rating */}
            <span className="text-[15px] font-semibold text-[#0d2b36]">{driverName}</span>
            {driverRating && (
              <span className="flex items-center gap-1 text-[14px] font-semibold text-[#0d2b36]">
                <FiStar className="w-3.5 h-3.5 fill-[#0d2b36] text-[#0d2b36]" />
                {driverRating}
              </span>
            )}

            {/* Divider pip */}
            {showMetaDivider && (
              <span className="text-[#c5d8dc] text-lg leading-none">|</span>
            )}

            {/* Instant booking badge */}
            {instantBooking && (
              <span className="flex items-center gap-1 text-[14px] font-semibold text-[#0d2b36]">
                <FiZap className="w-4 h-4 text-[#0d2b36]" />
                Instant Booking
              </span>
            )}

            {/* Seats badge */}
            {showSeatsMeta && (
              <span className="flex items-center gap-1.5 text-[14px] font-semibold text-[#0d2b36]">
                <FiUsers className="w-4 h-4" />
                Max. {seatsAvailable} 
              </span>
            )}
          </div>

        </div>
      </div>
      )}
    </motion.div>
  );
}
