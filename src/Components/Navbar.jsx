import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      // Glass UI on Navbar - Primary color with blur
      className="bg-blue-600/90 text-white p-4 shadow-xl backdrop-blur-md border-b border-white/30"
    >
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.08 }}>
          <Link to="/" className="text-2xl font-extrabold tracking-wide text-yellow-400"> {/* Logo in Secondary color */}
            BlaBla Cars
          </Link>
        </motion.div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm md:text-base font-semibold">
          
          {/* Trips */}
          <motion.div whileHover={{ scale: 1.04 }}>
            <Link to="/" className="relative group">
              Trips
              <span
                className="absolute left-0 -bottom-1 w-0 h-[3px] bg-yellow-400 transition-all group-hover:w-full" // Secondary color underline
              ></span>
            </Link>
          </motion.div>

          {/* My Bookings */}
          <motion.div whileHover={{ scale: 1.04 }}>
            <Link to="/bookings" className="relative group">
              My Bookings
              <span
                className="absolute left-0 -bottom-1 w-0 h-[3px] bg-yellow-400 transition-all group-hover:w-full" // Secondary color underline
              ></span>
            </Link>
          </motion.div>
            <ThemeToggle />

        </nav>
      </div>
    </motion.header>
  );
}