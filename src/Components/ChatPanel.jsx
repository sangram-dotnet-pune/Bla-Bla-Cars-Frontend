import { useEffect, useMemo, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { motion } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import api from "../api/apiClient";

const CHAT_HUB_CANDIDATES = () => {
  const gateway = import.meta.env.VITE_API_GATEWAY || "http://localhost:5003";
  return [`${gateway.replace(/\/$/, "")}/hubs/chat`];
};

const guidLike = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const toStringId = (value) => (value === null || value === undefined ? "" : String(value));

const firstGuid = (...values) => {
  for (const v of values) {
    const s = toStringId(v).trim();
    if (guidLike(s)) return s;
  }
  return "";
};

const mapHistoryMessage = (msg) => ({
  messageId: toStringId(msg.messageId || msg.id || `${Date.now()}-${Math.random()}`),
  senderId: toStringId(msg.senderId || msg.fromUserId || msg.userId),
  text: String(msg.messageText ?? msg.text ?? ""),
  sentAt: msg.sentAt || msg.createdAt || new Date().toISOString(),
});

export default function ChatPanel({ booking, tripOwner, chatPartnerName }) {
  const { user } = useAuth();

  const [connection, setConnection] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [participants, setParticipants] = useState({ passengerId: "", driverId: "" });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("connecting");
  const [error, setError] = useState("");

  const listEndRef = useRef(null);

  const chatTitle = useMemo(() => {
    if (chatPartnerName) return chatPartnerName;
    if (!booking) return "Chat";
    if (booking.type === "driver") return booking.driverName || booking.tripOwnerName || "Driver";
    return booking.passengerName || "Passenger";
  }, [booking, chatPartnerName]);

  useEffect(() => {
    setMessages([]);
    setInput("");
    setError("");
    setStatus(booking ? "connecting" : "idle");
  }, [booking?.bookingId]);

  useEffect(() => {
    if (!booking?.bookingId || !user?.userId) return undefined;

    let isCancelled = false;
    let conn;

    const start = async () => {
      try {
        const passengerId = firstGuid(
          booking.passengerId,
          booking.passengerUserId,
          booking.passengerGuid,
          booking.userId,
          booking.type === "driver" ? user?.userId : ""
        );
        const driverId = firstGuid(
          booking.driverId,
          booking.driverUserId,
          booking.driverGuid,
          booking.ownerGuid,
          booking.ownerUserId,
          tripOwner?.ownerGuid,
          tripOwner?.driverId,
          tripOwner?.driverUserId,
          tripOwner?.userId,
          booking.type === "passenger" ? user?.userId : ""
        );

        if (!guidLike(passengerId) || !guidLike(driverId)) {
          setStatus("disconnected");
          setError("Passenger/Driver ID is not a valid GUID for ChatService.");
          return;
        }

        const conversationRes = await api.post("/chat/conversation", {
          bookingId: booking.bookingId,
          passengerId,
          driverId,
        });

        const conv = conversationRes?.data;
        const convId = toStringId(conv?.conversationId);

        if (!guidLike(convId)) {
          setStatus("disconnected");
          setError("Conversation was not created correctly.");
          return;
        }

        setConversationId(convId);
        setParticipants({
          passengerId: toStringId(conv?.passengerId || passengerId),
          driverId: toStringId(conv?.driverId || driverId),
        });

        const candidates = CHAT_HUB_CANDIDATES();
        let lastHubError = null;
        for (const hubUrl of candidates) {
          try {
            conn = new HubConnectionBuilder()
              .withUrl(hubUrl, {
                accessTokenFactory: () => localStorage.getItem("token") || "",
                withCredentials: true,
              })
              .withAutomaticReconnect()
              .configureLogging(LogLevel.Error)
              .build();

            conn.on("ReceiveMessage", (senderId, messageText) => {
              if (!messageText) return;
              setMessages((prev) => [
                ...prev,
                {
                  messageId: `${Date.now()}-${Math.random()}`,
                  senderId: toStringId(senderId),
                  text: String(messageText),
                  sentAt: new Date().toISOString(),
                },
              ]);
            });

            await conn.start();
            await conn.invoke("JoinConversation", convId);
            lastHubError = null;
            break;
          } catch (hubErr) {
            lastHubError = hubErr;
            try {
              conn.off("ReceiveMessage");
              await conn.stop();
            } catch {
              // no-op
            }
            conn = null;
          }
        }

        if (!conn || lastHubError) {
          throw lastHubError || new Error("Unable to connect to any chat hub endpoint");
        }

        try {
          const historyRes = await api.get(`/chat/messages/${convId}`);
          const history = Array.isArray(historyRes?.data) ? historyRes.data : [];
          setMessages(history.map(mapHistoryMessage).filter((m) => m.text));
        } catch {
          try {
            const historyRes = await api.get(`/api/chat/messages/${convId}`);
            const history = Array.isArray(historyRes?.data) ? historyRes.data : [];
            setMessages(history.map(mapHistoryMessage).filter((m) => m.text));
          } catch {
            // ignore
          }
        }

        if (!isCancelled) {
          setConnection(conn);
          setStatus("connected");
        }
      } catch (err) {
        console.error("Chat setup failed:", err);
        if (!isCancelled) {
          setStatus("disconnected");
          setError("Unable to connect to chat hub.");
        }
      }
    };

    start();

    return () => {
      isCancelled = true;
      if (conn) {
        conn.off("ReceiveMessage");
        conn.stop();
      }
    };
  }, [booking, user?.userId, tripOwner?.ownerId]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const messageText = input.trim();
    if (!messageText || !connection || status !== "connected" || !conversationId) return;

    const senderId = toStringId(user?.userId);
    const receiverId = toStringId(
      senderId === participants.passengerId ? participants.driverId : participants.passengerId
    );

    if (!guidLike(senderId) || !guidLike(receiverId)) {
      setError("Invalid sender/receiver id for chat.");
      return;
    }

    setInput("");

    try {
      await connection.invoke("SendMessage", conversationId, senderId, receiverId, messageText);

      const active = JSON.parse(localStorage.getItem("activeChats") || "[]");
      const key = `booking-${booking.bookingId}`;
      if (!active.includes(key)) {
        active.push(key);
        localStorage.setItem("activeChats", JSON.stringify(active));
      }
    } catch (err) {
      console.error("Send failed:", err);
      setError("Failed to send message.");
      setInput(messageText);
    }
  };

  if (!booking) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F7FBFC] text-[#60767B]">
        Select a conversation to start chatting.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-[#054752] px-5 py-4 text-white border-b border-[#0a5e6e]">
        <div>
          <div>
            <h3 className="text-lg font-bold text-white">{chatTitle}</h3>
            <p className="text-xs text-[#C7E4ED] mt-0.5">Booking #{booking.bookingId}</p>
          </div>
        </div>
        {error && <p className="mt-2 text-xs text-[#FFE0E0]">{error}</p>}
      </div>

      <div className="flex-1 min-h-0 bg-[#F7FBFC] overflow-y-auto p-5 space-y-3">
        {messages.length === 0 && <div className="text-center py-10 text-[#60767B]">No messages yet.</div>}

        {messages.map((msg, idx) => {
          const fromSelf = toStringId(msg.senderId) === toStringId(user?.userId);
          return (
            <motion.div
              key={msg.messageId || `${msg.sentAt}-${idx}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${fromSelf ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] px-4 py-2.5 ${
                  fromSelf
                    ? "bg-[#2AA8D9] text-[#f5f0f0] rounded-2xl rounded-br-md"
                    : "bg-white border border-[#d6e4e8] text-[#e7eff0] rounded-2xl rounded-bl-md"
                }`}
                style={{ boxShadow: "0 4px 20px rgba(5, 71, 82, 0.08)" }}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                <p className={`mt-1.5 text-[10px] ${fromSelf ? "text-[#F7FCFF]" : "text-[#708C91]"}`}>
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={listEndRef} />
      </div>

      <div className="border-t border-[#d6e4e8] bg-white p-4">
        <div className="flex items-end gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={status === "connected" ? "Type a message" : "Connecting..."}
            disabled={status !== "connected"}
            className="flex-1 bg-[#F7FBFC] border border-[#d6e4e8] rounded-xl px-4 py-3 text-[#054752] outline-none focus:border-[#00AFF5]"
          />
          <button
            onClick={sendMessage}
            disabled={status !== "connected" || !input.trim()}
            className="bb-pill-button bb-button-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
