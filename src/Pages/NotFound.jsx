import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiHome, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef9fe] via-white to-[#eef9fe] flex items-center justify-center p-4 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl bb-elevation-soft border border-[#e4eef1] p-10 max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block mb-5"
        >
          <div className="w-16 h-16 rounded-full bg-[#eef9fe] flex items-center justify-center">
            <FiAlertTriangle className="w-8 h-8 text-[#00AFF5]" />
          </div>
        </motion.div>

        <p className="text-7xl font-black text-[#00AFF5] leading-none mb-2">404</p>
        <h1 className="text-2xl font-extrabold text-[#054752] mb-2">Page not found</h1>
        <p className="text-[#708c91] mb-7">
          The page you're looking for doesn't exist or has been moved. Check the URL and try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00AFF5] hover:bg-[#009ad9] text-white font-bold rounded-full transition-colors"
          >
            <FiHome className="w-4 h-4" /> Go Home
          </Link>
          <Link
            to="/trips"
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#c9dde3] text-[#054752] hover:bg-[#eef9fe] font-bold rounded-full transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" /> Find Rides
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
