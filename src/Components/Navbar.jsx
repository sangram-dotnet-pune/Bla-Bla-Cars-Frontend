import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css"

export default function Navbar() {
  return (
    <motion.header
  initial={{ y: -40, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="glass-navbar"
>

      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.08 }}>
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide text-teal-400 drop-shadow-md"
          >
            BlaBla Cars
          </Link>
        </motion.div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm md:text-base font-semibold text-white dark:text-gray-200">
          
          {/* Trips */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="relative group">
              Trips
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-teal-400 transition-all group-hover:w-full rounded-full"></span>
            </Link>
          </motion.div>

          {/* My Bookings */}
          <motion.div whileHover={{ scale: 1.05 }}>
            
<Link to="/bookings" className="glass-link">My Bookings</Link>
          </motion.div>

          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  );
}
