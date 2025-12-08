import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../Context/NotificationContext";

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-20 right-4 z-[9999] space-y-3 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl p-4 shadow-2xl backdrop-blur-lg border ${
              notification.type === "success"
                ? "bg-green-500/90 border-green-300/50"
                : "bg-red-500/90 border-red-300/50"
            } text-white`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">{notification.title}</h4>
                <p className="text-sm opacity-90">{notification.message}</p>
                <p className="text-xs opacity-70 mt-2">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white/80 hover:text-white text-xl font-bold"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
