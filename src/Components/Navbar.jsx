import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiLogOut, FiUser, FiEdit2, FiKey } from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";
import "./navbar.css";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setOpen((prev) => !prev);

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
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            <MdDirectionsCar className="w-6 h-6 text-blue-600" />
            <span className="hidden sm:inline">BlaBlaTrips</span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/trips" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300">
                  Find Rides
                </Link>
                <Link to="/create-trip" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300">
                  + Publish Ride
                </Link>
                <Link to="/my-trips" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300">
                  My Trips
                </Link>
                <Link to="/bookings" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300">
                  My Bookings
                </Link>
                <Link to="/chats" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300">
                  💬 Chats
                </Link>

                {/* USER PROFILE DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 border-l border-gray-300 pl-4 ml-2 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.firstName?.charAt(0) || "U"}
                    </div>
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm text-gray-600">Signed in as</p>
                          <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                        </div>
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                          <FiUser /> View Profile
                        </Link>
                        <Link to="/edit-profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                          <FiEdit2 /> Edit Profile
                        </Link>
                        <Link to="/change-password" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                          <FiKey /> Change Password
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                        >
                          <FiLogOut /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white/95"
          >
            <div className="px-4 py-4 space-y-3">
              {user ? (
                <>
                  <Link
                    to="/create-trip"
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    + Publish Ride
                  </Link>
                  <Link
                    to="/my-trips"
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Trips
                  </Link>
                  <Link
                    to="/bookings"
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/chats"
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    💬 Chats
                  </Link>
                  <Link
                    to="/profile"
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 text-center text-gray-700 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-4 py-2 text-center text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
