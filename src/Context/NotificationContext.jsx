import { createContext, useContext, useEffect, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user?.userId) {
      if (connection) {
        connection.stop();
        setConnection(null);
        setIsConnected(false);
      }
      return;
    }

    const hubUrl = import.meta.env.VITE_CHAT_HUB || 
                   `${import.meta.env.VITE_API_GATEWAY || "http://localhost:5001"}/hubs/chat`;

    const conn = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem("token") || "",
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Error)
      .build();

    // Listen for booking status changes
    conn.on("BookingStatusChanged", (notification) => {
      const newNotification = {
        id: Date.now(),
        type: notification.status === "Confirmed" ? "success" : "error",
        title: notification.status === "Confirmed" ? "Booking Approved! 🎉" : "Booking Rejected",
        message: notification.message,
        bookingId: notification.bookingId,
        tripId: notification.tripId,
        timestamp: notification.timestamp || new Date().toISOString(),
      };
      setNotifications((prev) => [newNotification, ...prev]);

      // Auto remove after 10 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
      }, 10000);
    });

    const startConnection = async () => {
      try {
        await conn.start();
        setIsConnected(true);

        // Register user
        if (user?.userId) {
          await conn.invoke("Register", user.userId);
        }
      } catch (err) {
        console.error("SignalR connection failed:", err);
        setIsConnected(false);
        
      }
    };

    startConnection();
    setConnection(conn);

    return () => {
      conn.off("BookingStatusChanged");
      conn.stop();
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
