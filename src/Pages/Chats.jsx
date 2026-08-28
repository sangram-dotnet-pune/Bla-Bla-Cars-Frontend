import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import ChatPanel from "../Components/ChatPanel";
import { useAuth } from "../Context/AuthContext";
import { FiMessageSquare } from "react-icons/fi";

const GUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const firstGuid = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const s = String(value).trim();
    if (GUID_REGEX.test(s)) return s;
  }
  return "";
};

const BOOKING_STATUS_MAP = {
  0: "Pending",
  1: "Rejected",
  2: "Confirmed",
  3: "Cancelled",
  4: "Failed",
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

const statusBadgeClass = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-[#E8F8FE] text-[#054752]";
    case "Pending":
      return "bg-[#FFF8E1] text-[#856404]";
    case "Rejected":
    case "Cancelled":
      return "bg-[#FDECEC] text-[#8A2A2A]";
    default:
      return "bg-[#EFF4F5] text-[#60767B]";
  }
};

export default function Chats() {
  const { user } = useAuth();

  const [allChats, setAllChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [tripDetails, setTripDetails] = useState({});
  const [userMeta, setUserMeta] = useState({});
  const [loading, setLoading] = useState(true);

  const getChatPartnerName = (chat) => {
    if (!chat) return "Unknown";
    if (chat.type === "driver") {
      const ownerId = tripDetails[chat.tripId]?.ownerId;
      return (
        userMeta[ownerId]?.name ||
        chat.driverName ||
        chat.tripOwnerName ||
        chat.ownerName ||
        "Driver"
      );
    }
    return chat.passengerName || "Passenger";
  };

  const loadChats = async () => {
    setLoading(true);
    try {
      const preSelectData = localStorage.getItem("preSelectChat");
      const preSelect = preSelectData ? JSON.parse(preSelectData) : null;
      if (preSelectData) localStorage.removeItem("preSelectChat");

      const [bookingsRes, myTripsRes] = await Promise.all([
        api.get("/booking"),
        api.get("/api/trip/my-trips"),
      ]);

      const myBookings = bookingsRes.data || [];
      const myTrips = myTripsRes.data || [];

      const chats = [];
      const tripsById = {};
      const metaByOwnerId = {};

      myBookings.forEach((b) => {
        chats.push({
          ...b,
          type: "driver",
          status: normalizeBookingStatus(b.status),
          conversationKey: `booking-${b.bookingId}`,
        });
      });

      for (const trip of myTrips) {
        try {
          const tripBookingsRes = await api.get(`/booking/trip/${trip.tripId}`);
          const tripBookings = tripBookingsRes.data || [];

          tripsById[trip.tripId] = trip;
          if (trip.ownerId && !metaByOwnerId[trip.ownerId]) {
            try {
              const userRes = await api.get(`/user/${trip.ownerId}`);
              metaByOwnerId[trip.ownerId] = {
                name: userRes.data?.fullName || userRes.data?.name || "Driver",
                guid: firstGuid(
                  userRes.data?.userId,
                  userRes.data?.id,
                  userRes.data?.guid,
                  userRes.data?.userGuid
                ),
              };
            } catch {
              metaByOwnerId[trip.ownerId] = { name: "Driver", guid: "" };
            }
          }

          tripBookings.forEach((b) => {
            chats.push({
              ...b,
              type: "passenger",
              status: normalizeBookingStatus(b.status),
              tripData: trip,
              driverId: b.driverId || b.ownerId || trip.ownerId,
              conversationKey: `booking-${b.bookingId}`,
            });
          });
        } catch (err) {
          console.error(`Failed loading bookings for trip ${trip.tripId}`, err);
        }
      }

      const tripIds = [...new Set(chats.map((c) => c.tripId).filter(Boolean))];
      for (const tripId of tripIds) {
        if (tripsById[tripId]) continue;
        try {
          const tripRes = await api.get(`/api/trip/${tripId}`);
          tripsById[tripId] = tripRes.data;
          const ownerId = tripRes.data?.ownerId;
          if (ownerId && !metaByOwnerId[ownerId]) {
            try {
              const ownerRes = await api.get(`/user/${ownerId}`);
              metaByOwnerId[ownerId] = {
                name: ownerRes.data?.fullName || ownerRes.data?.name || "Driver",
                guid: firstGuid(
                  ownerRes.data?.userId,
                  ownerRes.data?.id,
                  ownerRes.data?.guid,
                  ownerRes.data?.userGuid
                ),
              };
            } catch {
              metaByOwnerId[ownerId] = { name: "Driver", guid: "" };
            }
          }
        } catch {
          // ignore
        }
      }

      const byPair = new Map();
      const currentUserGuid = firstGuid(user?.userId, user?.id, user?.guid);
      chats.forEach((chat) => {
        const trip = tripsById[chat.tripId];
        const ownerId = trip?.ownerId;
        const ownerGuid = ownerId ? metaByOwnerId[ownerId]?.guid : "";

        const driverId = firstGuid(
          chat.driverId,
          chat.driverUserId,
          chat.driverGuid,
          chat.ownerUserId,
          chat.ownerGuid,
          trip?.driverId,
          trip?.ownerId,
          trip?.userId,
          chat.type === "passenger" ? currentUserGuid : "",
          ownerGuid
        );
        const passengerId = firstGuid(
          chat.passengerId,
          chat.passengerUserId,
          chat.passengerGuid,
          chat.userId,
          chat.type === "driver" ? currentUserGuid : ""
        );

        if (!driverId || !passengerId) return;

        const pairKey = `pair-${[driverId, passengerId].sort().join("-")}`;
        if (!byPair.has(pairKey)) {
          byPair.set(pairKey, []);
        }
        byPair.get(pairKey).push({
          ...chat,
          status: normalizeBookingStatus(chat.status),
          driverId,
          passengerId,
        });
      });

      // One conversation per driver<->passenger pair (not per booking).
      const finalChats = [];
      byPair.forEach((memberChats) => {
        const memberBookingIds = memberChats
          .map((c) => String(c.bookingId))
          .filter(Boolean);
        const canonicalBookingId = [...memberBookingIds].sort()[0] || "";

        const representative =
          [...memberChats].sort((a, b) => {
            const rankA = a.status === "Confirmed" ? 0 : 1;
            const rankB = b.status === "Confirmed" ? 0 : 1;
            return rankA - rankB;
          })[0] || memberChats[0];

        finalChats.push({
          ...representative,
          conversationKey: `pair-${[representative.driverId, representative.passengerId]
            .sort()
            .join("-")}`,
          canonicalBookingId,
          memberBookingIds,
        });
      });

      setAllChats(finalChats);
      setTripDetails(tripsById);
      setUserMeta(metaByOwnerId);

      if (preSelect?.bookingId) {
        const matched = finalChats.find((c) =>
          c.memberBookingIds.includes(String(preSelect.bookingId))
        );
        setSelectedChat(matched || finalChats[0] || null);
      } else {
        setSelectedChat((prev) => prev || finalChats[0] || null);
      }
    } catch (err) {
      console.error("Failed to load chats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, [user?.userId]);

  return (
    <div className="min-h-screen pt-20 pb-12 bb-section">
      <div className="max-w-7xl mx-auto w-full h-[calc(100vh-120px)] flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-extrabold flex items-center gap-3 text-[#054752]">
            <FiMessageSquare className="w-10 h-10 text-[#00AFF5]" />
            Messages
          </h1>
          <p className="mt-1">Chat with drivers and passengers</p>
        </motion.div>

        <div className="flex-1 min-h-0 w-full bb-card overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row">
            <aside className="w-full lg:w-[360px] shrink-0 border-b lg:border-b-0 lg:border-r border-[#d9e7eb] bg-white flex flex-col min-h-0">
              <div className="bg-[#054752] px-5 py-4 text-white">
                <h2 className="text-lg font-bold text-white">Conversations</h2>
                <p className="text-[#C7E4ED] text-xs mt-1">{allChats.length} chats</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-[#60767B]">Loading chats...</div>
                ) : allChats.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <p className="font-medium text-[#054752]">No conversations</p>
                    <p className="text-sm mt-2 text-[#60767B]">Open a booking and click chat to start messaging.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {allChats.map((chat, i) => {
                      const trip = tripDetails[chat.tripId];
                      const from = chat.startLocation || trip?.startLocation || "Unknown";
                      const to = chat.endLocation || trip?.endLocation || "Unknown";
                      const isActive = selectedChat?.conversationKey === chat.conversationKey;
                      return (
                        <motion.button
                          key={chat.conversationKey}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => setSelectedChat(chat)}
                          className={`w-full px-4 py-3 border-b border-[#edf3f5] transition-all text-left ${
                            isActive ? "bg-[#EAF8FD]" : "hover:bg-[#F2FAFD]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-[#00AFF5] rounded-full flex items-center justify-center text-white font-bold text-base shrink-0">
                              {getChatPartnerName(chat).charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-[#054752] truncate">{getChatPartnerName(chat)}</p>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadgeClass(chat.status)}`}>
                                  {chat.status}
                                </span>
                              </div>
                              <p className="text-xs text-[#60767B] truncate mt-0.5">
                                {from} {"->"} {to}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </aside>

            <section className="flex-1 min-h-0 bg-white">
              <ChatPanel
                booking={selectedChat}
                conversationBookingId={selectedChat ? selectedChat.canonicalBookingId : ""}
                tripOwner={selectedChat ? (tripDetails[selectedChat.tripId] || selectedChat.tripData || null) : null}
                chatPartnerName={selectedChat ? getChatPartnerName(selectedChat) : ""}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
