import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./navbar.css";

// ✅ IMPORT YOUR LOCAL PROFILE IMAGE
import userImg from "../assets/user.png";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();

  const toggleDropdown = () => setOpen((prev) => !prev);

  const buttonStyle =
    "px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white " +
    "backdrop-blur-md shadow-lg hover:bg-white/20 transition-all duration-300 " +
    "hover:shadow-[0_0_12px_rgba(68,237,217,0.6)]";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="glass-navbar dark px-6 py-3 flex justify-between items-center">

      {/* LOGO */}
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-wide"
        style={{ letterSpacing: "1px", color: "white" }}
      >
        BlaBlaTrips
      </Link>

      {/* RIGHT SIDE OPTIONS */}
      <div className="flex items-center gap-5">

        {/* Publish Ride */}
        {user && (
          <Link to="/create-trip" className={buttonStyle}>
            Publish Ride
          </Link>
        )}

        {/* Publish Ride */}
        {user && (
          <Link to="/bookings" className={buttonStyle}>
            My Bookings
          </Link>
        )}

        {/* Login/Register */}
        {!user && (
          <>
            <Link to="/login" className={buttonStyle}>Login</Link>
            <Link to="/register" className={buttonStyle}>Register</Link>
          </>
        )}

        {/* Profile Icon + Dropdown */}
        {user && (
          <div className="relative z-50" ref={dropdownRef}>
            {/* Profile Image Button */}
            <img
              src={userImg}
              alt="profile"
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full border border-white/30 cursor-pointer 
                         hover:shadow-[0_0_12px_rgba(255,255,255,0.7)] transition"
            />

            {/* DROPDOWN CARD */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-64 bg-white/20 backdrop-blur-xl 
border border-white/30 shadow-xl rounded-2xl p-4 text-white z-50"

                >
                  {/* Avatar */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={userImg}
                      className="w-12 h-12 rounded-full border border-white/40"
                    />
                    <div>
                      <p className="font-bold text-lg">{user.fullName}</p>
                      <p className="text-sm opacity-80">{user.email}</p>
                      {user.phoneNumber && (
                        <p className="text-sm opacity-80">{user.phoneNumber}</p>
                      )}
                    </div>
                  </div>

                  <hr className="border-white/30 my-3" />

                  {/* Profile Page */}
                  <Link
                    to="/profile"
                    className="block text-center bg-white/10 border border-white/20 
                               py-2 rounded-lg font-semibold hover:bg-white/20 transition"
                  >
                    View Profile
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full mt-3 bg-red-600 py-2 rounded-lg font-semibold 
                               hover:bg-red-700 transition"
                  >
                    Logout
                  </button>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
}
