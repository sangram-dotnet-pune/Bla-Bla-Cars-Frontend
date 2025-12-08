import { motion } from "framer-motion";
import { useNotifications } from "../Context/NotificationContext";

export default function ConnectionStatus() {
  const { isConnected } = useNotifications();

  if (!isConnected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 left-4 z-50"
    >
      <div className="flex items-center gap-2 bg-green-500/90 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-lg border border-green-300/50">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-semibold">Live Notifications Active</span>
      </div>
    </motion.div>
  );
}
