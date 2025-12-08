import { useEffect, useMemo, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import api from "../api/apiClient";

// EVENTS the backend sends
const RECEIVE_EVENTS = ["ReceiveBookingMessage", "ReceivePrivateMessage", "ReceiveMessage", "ReceiveChatHistory", "UserJoinedBooking", "UserLeftBooking"];

// Resolve SignalR URL
const hubUrl = () => {
  const base = import.meta.env.VITE_CHAT_HUB;
  if (base) return base;
  const gateway = import.meta.env.VITE_API_GATEWAY || "http://localhost:5001";
  return `${gateway.replace(/\/$/, "")}/hubs/chat`;
};

export default function ChatPanel({ booking, tripOwner, onClose }) {
  const { user } = useAuth();

  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("connecting");
  const [error, setError] = useState(null);

  const listEndRef = useRef(null);

  const roomId = useMemo(() => {
    return booking?.bookingId?.toString() || booking?.tripId?.toString() || null;
  }, [booking]);

  /** Reset when new room changes */
  useEffect(() => {
    setMessages([]);
    setError(null);
    setStatus(roomId ? "connecting" : "idle");
  }, [roomId]);

  /** Create SignalR connection */
  useEffect(() => {
    if (!booking || !roomId) return;

    const conn = new HubConnectionBuilder()
      .withUrl(hubUrl(), {
        accessTokenFactory: () => localStorage.getItem("token") || "",
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Error)
      .build();

    // Register listeners for backend events
    RECEIVE_EVENTS.forEach((evt) => {
      conn.on(evt, (arg1, arg2, arg3) => {
        // Handle chat history (array of messages)
        if (evt === "ReceiveChatHistory") {
          const history = Array.isArray(arg1) ? arg1 : [];
          const formattedMessages = history.map((msg) => ({
            messageId: msg.messageId,
            text: msg.messageText,
            senderId: msg.senderId,
            sentAt: msg.timestamp,
            fromSelf: msg.senderId === user?.userId,
            isRead: msg.isRead ?? false,
          }));
          setMessages(formattedMessages);
          return;
        }

        // Skip system join/leave events
        if (evt === "UserJoinedBooking" || evt === "UserLeftBooking") {
          return;
        }

        // Handle ReceiveBookingMessage - can be object or primitive
        let messageObj = null;

        if (evt === "ReceiveBookingMessage") {
          // Check if arg1 is already an object (full ChatMessage from DB)
          if (typeof arg1 === "object" && arg1 !== null && arg1.messageText) {
              messageObj = {
                messageId: arg1.messageId || `${Date.now()}-${Math.random()}`,
              messageId: arg1.messageId,
              text: arg1.messageText,
              senderId: arg1.senderId,
              sentAt: arg1.timestamp,
              isRead: arg1.isRead ?? false,
              isRead: arg1.isRead,
            };
          } else {
            // Fallback: arg1 = fromUserId, arg2 = message (old format)
              messageId: `${Date.now()}-${Math.random()}`,
            messageObj = {
              text: arg2 || "",
              senderId: arg1,
              sentAt: new Date().toISOString(),
              isRead: false,
              fromSelf: arg1 === user?.userId,
            };
          }
        } else {
          // Handle other event types
          const payload = arg1;
            messageId: payload?.messageId || `${Date.now()}-${Math.random()}`,
          messageObj = {
            text:
              payload?.messageText ||
              payload?.message ||
              payload?.content ||
              payload?.text ||
              arg2 ||
              "",
            senderId: payload?.senderId || payload?.userId || payload?.fromUserId || arg1,
            sentAt: payload?.timestamp || new Date().toISOString(),
            isRead: payload?.isRead ?? false,
            fromSelf: (payload?.senderId || payload?.userId || arg1) === user?.userId,
          };
        }

        // Skip empty messages
        if (!messageObj.text || typeof messageObj.text !== "string") return;

        setMessages((prev) => [
          ...prev,
          messageObj,
        ]);
      });
    });

    const start = async () => {
      try {
        await conn.start();

        // Register user first
        if (user?.userId) {
          try {
            await conn.invoke("Register", user.userId);
          } catch (err) {
            console.warn("Register failed:", err);
          }
        }

        // Join booking room
        if (booking?.bookingId) {
          try {
            await conn.invoke("JoinBookingRoom", booking.bookingId);
            setStatus("connected");
            
            // Fallback: Fetch message history via API if not received from SignalR
            setTimeout(async () => {
              if (messages.length === 0) {
                try {
                  const response = await api.get(`/chat/messages/${booking.bookingId}`);
                  const history = response.data || [];
                  const formattedMessages = history.map((msg) => ({
                    messageId: msg.messageId,
                    text: msg.messageText,
                    senderId: msg.senderId,
                    sentAt: msg.timestamp,
                    fromSelf: msg.senderId === user?.userId,
                    isRead: msg.isRead,
                  }));
                  setMessages(formattedMessages);
                } catch (err) {
                  console.warn("Failed to load message history from API:", err);
                }
              }
            }, 500);
          } catch (err) {
            console.error("JoinBookingRoom failed:", err);
            setError("Failed to join booking chat room");
            setStatus("disconnected");
          }
        } else {
          throw new Error("No booking ID available");
        }
      } catch (err) {
        console.error("Chat connection error:", err);
        setError(err?.message || "Connection failed");
        setStatus("disconnected");
      }
    };

    start();
    setConnection(conn);

    return () => {
      RECEIVE_EVENTS.forEach((evt) => conn.off(evt));
      conn.stop();
    };
  }, [booking, roomId, user]);

  /** Auto scroll */
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Mark unread messages as read when visible */
  useEffect(() => {
    const markAsRead = async (msg) => {
      if (!msg?.messageId) return;
      try {
        await api.post(`/chat/mark-as-read/${msg.messageId}`);
        setMessages((prev) => prev.map((m) => (m.messageId === msg.messageId ? { ...m, isRead: true } : m)));
      } catch (err) {
        console.warn("Failed to mark as read", err);
      }
    };

    messages
      .filter((m) => !m.fromSelf && !m.isRead && m.messageId)
      .forEach((msg) => markAsRead(msg));
  }, [messages]);

  /** Send message */
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !connection || status !== "connected") return;

    setInput("");

    try {
      // Send to booking room - don't add locally, let the backend broadcast it
      if (booking?.bookingId) {
        await connection.invoke("SendMessageToBooking", booking.bookingId, text);
        
        // Save this conversation to localStorage as active
        const conversationId = booking.bookingId ? `booking-${booking.bookingId}` : `trip-${booking.bookingId}`;
        const savedChats = localStorage.getItem("activeChats");
        const activeChats = savedChats ? JSON.parse(savedChats) : [];
        
        if (!activeChats.includes(conversationId)) {
          activeChats.push(conversationId);
          localStorage.setItem("activeChats", JSON.stringify(activeChats));
        }
      }
    } catch (err) {
      console.error("Send failed:", err);
      setError(err?.message || "Failed to send message");
      // Restore input on error
      setInput(text);
    }
  };

  // Fallback driver/owner info
  const ownerName =
    tripOwner?.fullName ||
    tripOwner?.driverName ||
    tripOwner?.ownerName ||
    booking?.tripOwnerName ||
    booking?.driverName ||
    booking?.ownerName ||
    "Trip owner";

  const ownerPhone =
    tripOwner?.phoneNumber || tripOwner?.contactNumber || booking?.ownerPhone;

  const ownerEmail = tripOwner?.email || booking?.ownerEmail;

  if (!booking) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-4xl rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                    💬
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{ownerName}</h3>
                    <p className="text-sm text-blue-100">
                      Booking #{booking.bookingId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-blue-50">
                  {ownerPhone && (
                    <div className="flex items-center gap-1">
                      <span>📞</span>
                      <span>{ownerPhone}</span>
                    </div>
                  )}
                  {ownerEmail && (
                    <div className="flex items-center gap-1">
                      <span>✉️</span>
                      <span>{ownerEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${
                    status === "connected" ? "bg-green-400 animate-pulse" :
                    status === "connecting" ? "bg-yellow-400" :
                    "bg-red-400"
                  }`} />
                  <span className="capitalize">{status}</span>
                </div>

                {error && (
                  <p className="text-xs text-red-200 bg-red-500/20 rounded-lg px-2 py-1 max-w-xs">
                    {error}
                  </p>
                )}

                <button
                  onClick={onClose}
                  className="rounded-full bg-white/20 hover:bg-white/30 px-4 py-2 text-sm font-semibold transition-all"
                >
                  ✕ Close
                </button>
              </div>
            </div>
          </div>

          {/* CHAT LIST */}
          <div className="bg-gradient-to-b from-gray-50 to-white max-h-[60vh] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-3">👋</div>
                <p className="text-gray-500">
                  No messages yet. Start the conversation!
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <motion.div
                key={msg.messageId || `${msg.sentAt}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  msg.fromSelf ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                    msg.fromSelf
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>

                  <div className={`mt-2 text-[11px] flex items-center gap-2 ${
                    msg.fromSelf ? "text-blue-100" : "text-gray-500"
                  }`}>
                    <span>{new Date(msg.sentAt).toLocaleTimeString()}</span>
                    {msg.isRead && msg.fromSelf && <span>✓✓</span>}
                  </div>
                </div>
              </motion.div>
            ))}

            <div ref={listEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className="border-t border-gray-200 bg-white p-5">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={
                    status === "connected"
                      ? "Type your message..."
                      : "Connecting to chat..."
                  }
                  disabled={status !== "connected"}
                  className="w-full rounded-2xl border-2 border-gray-300 bg-gray-50 px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                onClick={sendMessage}
                disabled={status !== "connected" || !input.trim()}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  Send
                  <span>📤</span>
                </span>
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-2 text-center">
              Press Enter to send • Trip ID: {booking.tripId}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
