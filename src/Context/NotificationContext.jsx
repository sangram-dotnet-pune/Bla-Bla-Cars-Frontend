import { createContext, useContext, useEffect, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

const hubCandidates = () => {
  const gateway = import.meta.env.VITE_API_GATEWAY || "http://localhost:5003";
  return [`${gateway.replace(/\/$/, "")}/hubs/chat`];
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user?.userId) {
      setIsConnected(false);
      return undefined;
    }

    const start = async () => {
      let activeConn = null;
      try {
        const candidates = hubCandidates();

        for (const url of candidates) {
          try {
           const conn = new HubConnectionBuilder()
  .withUrl(url, {
    accessTokenFactory: () => localStorage.getItem("token") || "",
  })
  .withAutomaticReconnect()
  .configureLogging(LogLevel.Error)
  .build();

            conn.on("ReceiveMessage", (senderId, messageText) => {
              if (!messageText) return;
              const n = {
                id: Date.now() + Math.random(),
                type: "success",
                title: "New Message",
                message: String(messageText),
                senderId: senderId ? String(senderId) : null,
                timestamp: new Date().toISOString(),
              };

              setNotifications((prev) => [n, ...prev]);
              setTimeout(() => {
                setNotifications((prev) => prev.filter((x) => x.id !== n.id));
              }, 7000);
            });

            await conn.start();
            activeConn = conn;
            break;
          } catch {
            // try next endpoint
          }
        }

        if (!activeConn) throw new Error("No reachable chat hub endpoint");
        setIsConnected(true);
        return activeConn;
      } catch (err) {
        console.error("SignalR notification connection failed:", err);
        setIsConnected(false);
        return null;
      }
    };

    let conn;
    start().then((c) => {
      conn = c;
    });

    return () => {
      if (conn) {
        conn.off("ReceiveMessage");
        conn.stop();
      }
      setIsConnected(false);
    };
  }, [user?.userId]);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        removeNotification,
        isConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
