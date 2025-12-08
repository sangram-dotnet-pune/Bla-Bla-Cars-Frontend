import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import ChatPanel from "../Components/ChatPanel";
import { useAuth } from "../Context/AuthContext";
import { FiMessageSquare, FiUser, FiX } from "react-icons/fi";

// Utility function to determine the chat partner name (retained)
const getChatPartnerName = (chat, tripDetails, userNames) => {
    if (!chat || !tripDetails || !userNames) return "Unknown";
    // If user is a passenger chatting with the driver (the trip owner)
    if (chat.type === "driver") {
        const ownerId = tripDetails[chat.tripId]?.ownerId;
        return userNames[ownerId] || "Driver";
    }
    // If user is a driver chatting with a passenger
    return chat.passengerName || "Passenger";
};

export default function Chats() {
  const { user } = useAuth();
  const location = useLocation();

  const [allChats, setAllChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [tripDetails, setTripDetails] = useState({});
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [allChats]);

  // loadChats function (retained)
  const loadChats = async () => {
    setLoading(true);
    let chatsList = [];
    let targetChat = null; 

    // 1. Get pre-select data from localStorage and clear it
    const preSelectDataString = localStorage.getItem("preSelectChat");
    if (preSelectDataString) {
        targetChat = JSON.parse(preSelectDataString);
        localStorage.removeItem("preSelectChat");
    }

    // Load active conversation IDs
    const savedChats = localStorage.getItem("activeChats");
    const activeConversationIds = savedChats ? JSON.parse(savedChats) : [];

    try {
        const finalConversationIds = new Set();
        let preSelectedChatData = null;

        // --- Step 1: Handle Pre-selected Chat (High Priority) ---
        if (targetChat) {
            let bookingData = null;
            let conversationId;

            if (targetChat.type === "driver") {
                conversationId = `booking-${targetChat.bookingId}`;
                const bookingsRes = await api.get("/booking");
                bookingData = (bookingsRes.data || []).find(b => b.bookingId === targetChat.bookingId);
            } else if (targetChat.type === "passenger") {
                conversationId = `trip-${targetChat.bookingId}`;
                const bookingsRes = await api.get(`/booking/trip/${targetChat.tripId}`);
                bookingData = (bookingsRes.data || []).find(b => b.bookingId === targetChat.bookingId);
            }

            if (bookingData) {
                preSelectedChatData = {
                    ...bookingData,
                    type: targetChat.type,
                    conversationId: conversationId,
                };
                finalConversationIds.add(conversationId);
                chatsList.push(preSelectedChatData);
            }
        }

        // --- Step 2: Load Other Active Chats (from activeConversationIds) ---
        const bookingsRes = await api.get("/booking");
        const bookings = bookingsRes.data || [];
          const tripsRes = await api.get("/api/trip/my-trips");
        const myTrips = tripsRes.data || [];

        for (const convId of activeConversationIds) {
            if (finalConversationIds.has(convId)) continue;

            if (convId.startsWith("booking-")) {
                const bookingId = parseInt(convId.replace("booking-", ""));
                const booking = bookings.find(b => b.bookingId === bookingId);
                if (booking) {
                    chatsList.push({
                        ...booking,
                        type: "driver",
                        conversationId: `booking-${booking.bookingId}`,
                    });
                    finalConversationIds.add(convId);
                }
            } else if (convId.startsWith("trip-")) {
                const bookingId = parseInt(convId.replace("trip-", ""));
                for (const trip of myTrips) {
                    try {
                        const bookingsForTrip = await api.get(`/booking/trip/${trip.tripId}`);
                        const booking = (bookingsForTrip.data || []).find(b => b.bookingId === bookingId);
                        
                        if (booking) {
                            chatsList.push({
                                ...booking,
                                type: "passenger",
                                conversationId: `trip-${booking.bookingId}`,
                                tripData: trip,
                            });
                            finalConversationIds.add(convId);
                            break;
                        }
                    } catch (err) {
                        console.error(`Failed to load bookings for trip ${trip.tripId}`, err);
                    }
                }
            }
        }

        const uniqueChats = Array.from(finalConversationIds).map(id => chatsList.find(c => c.conversationId === id));
        setAllChats(uniqueChats);

        // --- Step 3: Set Selected Chat ---
        if (preSelectedChatData) {
            setSelectedChat(preSelectedChatData);
        } else if (uniqueChats.length > 0 && !selectedChat) {
            setSelectedChat(uniqueChats[0]);
        }
        
        // --- Step 4: Fetch Trip Details and User Names ---
        const tripIds = [...new Set(uniqueChats.map(c => c.tripId).filter(id => id))];
        const newTripDetails = {};
        const newUserNames = {};
        
        for (const tripId of tripIds) {
          try {
            const tripRes = await api.get(`/api/Trip/${tripId}`);
            newTripDetails[tripId] = tripRes.data;
            
            if (tripRes.data?.ownerId) {
              if (!newUserNames[tripRes.data.ownerId]) {
                try {
                  const userRes = await api.get(`/user/${tripRes.data.ownerId}`);
                  newUserNames[tripRes.data.ownerId] = userRes.data?.fullName || userRes.data?.name || "Driver";
                } catch (err) {
                  console.error("Failed to load user", err);
                  newUserNames[tripRes.data.ownerId] = "Driver";
                }
              }
            }
          } catch (err) {
            console.error(`Failed to load trip ${tripId}`, err);
          }
        }

        setTripDetails(newTripDetails);
        setUserNames(newUserNames);

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl **w-full** h-[calc(100vh-120px)] flex flex-col"> 
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <FiMessageSquare className="w-10 h-10 text-blue-600" />
            Messages
          </h1>
          <p className="text-gray-600 mt-1">Chat with drivers and passengers</p>
        </motion.div>

        {/* Main Container - Left Side Only */}
        <div className="flex-1 min-h-0 w-full">
          {!selectedChat ? (
            // Conversations List View
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden h-full"
            >
              {/* Conversations Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h2 className="text-xl font-bold">Conversations</h2>
                <p className="text-blue-100 text-sm mt-1">{allChats.length} chats</p>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : allChats.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="text-4xl mb-3">💭</div>
                    <p className="text-gray-500 font-medium">No conversations</p>
                    <p className="text-gray-400 text-sm mt-2">Click "Chat with Owner" from booking or "Chat with Passenger" from your trips to start messaging</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {allChats.map((chat, i) => (
                      <motion.button
                        key={chat.conversationId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedChat(chat)}
                        className="w-full px-4 py-4 border-b border-gray-100 hover:bg-blue-50 transition-all text-left"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {getChatPartnerName(chat, tripDetails, userNames).charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {getChatPartnerName(chat, tripDetails, userNames)}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {tripDetails[chat.tripId]?.startLocation || "Unknown"} → {tripDetails[chat.tripId]?.endLocation || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            chat.status === "Confirmed" ? "bg-green-100 text-green-700" :
                            chat.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {chat.status}
                          </span>
                          <span className="text-xs text-gray-400">₹{chat.totalAmount}</span>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          ) : (
            // Chat View
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden h-full"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedChat.conversationId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {/* Chat Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex items-center justify-between flex-shrink-0">
                    <div>
                      <h3 className="text-xl font-bold">
                        {getChatPartnerName(selectedChat, tripDetails, userNames)}
                      </h3>
                      <p className="text-blue-100 text-sm mt-1">
                        {tripDetails[selectedChat.tripId]?.startLocation || "Unknown"} → {tripDetails[selectedChat.tripId]?.endLocation || "Unknown"}
                      </p>
                    </div>
                    {/* Back button */}
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="p-2 hover:bg-blue-500 rounded-full transition-all"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Chat Panel */}
                  <ChatPanel
                    booking={selectedChat}
                    tripOwner={selectedChat.type === "driver" ? tripDetails[selectedChat.tripId] : null}
                    onClose={() => setSelectedChat(null)}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}