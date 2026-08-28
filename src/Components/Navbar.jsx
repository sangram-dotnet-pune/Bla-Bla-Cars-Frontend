import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiLogOut, FiUser, FiKey, FiMessageCircle, FiSearch, FiLogIn, FiUserPlus, FiBookmark, FiMap } from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";
import "./Navbar.css";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const isLoggedIn = Boolean(user?.userId || user?.id || user?.email);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();

  const goToSearch = () => {
    setOpen(false);
    setMobileMenuOpen(false);
    navigate("/trips", { state: { focusSearch: true } });
  };

  const toggleDropdown = () => setOpen((prev) => !prev);

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

  const desktopNavClass = ({ isActive }) =>
    `px-4 py-2 text-[15px] font-semibold transition-all duration-300 rounded-xl ${
      isActive
        ? "text-[#00AFF5] bg-[#EAF8FE]"
        : "bb-nav-link text-[#054752] hover:text-[#00AFF5] hover:bg-[#eef9fe]"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `block w-full px-4 py-2.5 text-[15px] text-left rounded-2xl transition-colors ${
      isActive
        ? "text-[#00AFF5] bg-[#EAF8FE] font-semibold"
        : "text-[#054752] hover:bg-[#eef9fe]"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bb-nav-surface backdrop-blur-xl">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-[72px]">

          {/* Logo — pinned left */}
          <Link
            to="/"
            className="flex items-center gap-3 text-[1.75rem] font-extrabold text-[#054752] hover:opacity-80 transition-opacity shrink-0"
          >
            <MdDirectionsCar className="w-9 h-9 text-[#00AFF5]" />
            <span className="hidden sm:inline tracking-tight">BlaBlaTrips</span>
          </Link>

          {/* Right actions — pinned right via ml-auto */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {/* Search icon */}
            <button
              onClick={goToSearch}
              aria-label="Search rides"
              className="w-11 h-11 flex items-center justify-center rounded-2xl text-[#054752] hover:text-[#00AFF5] hover:bg-[#eef9fe] transition-all duration-300"
            >
              <FiSearch className="w-6 h-6" />
            </button>

            {/* Publish ride */}
            <NavLink to="/create-trip" className={desktopNavClass}>
              + Publish Ride
            </NavLink>

            {/* Profile dropdown */}
            <div className="relative ml-3 pl-3 border-l border-[#d6e4e8]" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                aria-label="Account"
                className="w-10 h-10 rounded-full bg-[#00AFF5] flex items-center justify-center text-white font-bold text-base hover:opacity-90 transition-opacity"
              >
                {isLoggedIn ? (user?.fullName?.charAt(0) || "U") : <FiUser className="w-5 h-5" />}
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl bb-elevation-soft border border-[#d6e4e8] overflow-hidden"
                  >
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-[#e4eef1]">
                          <p className="text-sm text-[#8aacb1]">Signed in as</p>
                          <p className="font-bold text-[#054752] text-[15px]">{user?.fullName}</p>
                        </div>
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[14px] text-[#054752] hover:bg-[#eef9fe] transition-colors" onClick={() => setOpen(false)}>
                          <FiUser className="w-4 h-4" /> View Profile
                        </Link>
                        <Link to="/my-trips" className="flex items-center gap-3 px-4 py-3 text-[14px] text-[#054752] hover:bg-[#eef9fe] transition-colors" onClick={() => setOpen(false)}>
                          <FiMap className="w-4 h-4" /> My Trips
                        </Link>
                        <Link to="/bookings" className="flex items-center gap-3 px-4 py-3 text-[14px] text-[#054752] hover:bg-[#eef9fe] transition-colors" onClick={() => setOpen(false)}>
                          <FiBookmark className="w-4 h-4" /> My Bookings
                        </Link>
                        <Link to="/change-password" className="flex items-center gap-3 px-4 py-3 text-[14px] text-[#054752] hover:bg-[#eef9fe] transition-colors" onClick={() => setOpen(false)}>
                          <FiKey className="w-4 h-4" /> Change Password
                        </Link>
                        <Link to="/chats" className="flex items-center gap-3 px-4 py-3 text-[14px] text-[#054752] hover:bg-[#eef9fe] transition-colors" onClick={() => setOpen(false)}>
                          <FiMessageCircle className="w-4 h-4" /> Chats
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[14px] text-red-600 hover:bg-red-50 border-t border-[#e4eef1] transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-[#e4eef1]">
                          <p className="text-sm text-[#8aacb1]">Welcome</p>
                          <p className="font-bold text-[#054752] text-[15px]">Join BlaBlaTrips</p>
                        </div>
                        <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-[14px] text-[#054752] hover:bg-[#eef9fe] transition-colors" onClick={() => setOpen(false)}>
                          <FiLogIn className="w-4 h-4" /> Login
                        </Link>
                        <Link to="/register" className="flex items-center gap-3 px-4 py-3 text-[14px] text-[#054752] hover:bg-[#eef9fe] border-t border-[#e4eef1] transition-colors" onClick={() => setOpen(false)}>
                          <FiUserPlus className="w-4 h-4" /> Register
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile hamburger — always far right */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden ml-auto text-[#054752] hover:text-[#00AFF5] transition-colors"
          >
            {mobileMenuOpen ? <FiX className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#d6e4e8] bg-white/95"
          >
            <div className="px-4 py-4 space-y-2">
              {isLoggedIn ? (
                <>
                  {/* User greeting */}
                  <div className="flex items-center gap-3 px-4 py-3 mb-1 bg-[#eef9fe] rounded-2xl">
                    <div className="w-9 h-9 rounded-full bg-[#00AFF5] flex items-center justify-center text-white font-bold text-base shrink-0">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                    <span className="font-bold text-[#054752] text-[15px]">{user?.fullName}</span>
                  </div>
                  <button onClick={goToSearch} className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-left text-[#054752] hover:bg-[#eef9fe] rounded-2xl transition-colors">
                    <FiSearch className="w-5 h-5 text-[#00AFF5]" /> Search rides
                  </button>
                  <NavLink to="/trips" className={mobileNavClass} onClick={() => setMobileMenuOpen(false)}>
                    Find Rides
                  </NavLink>
                  <NavLink to="/create-trip" className={mobileNavClass} onClick={() => setMobileMenuOpen(false)}>
                    + Publish Ride
                  </NavLink>
                  <NavLink to="/my-trips" className={mobileNavClass} onClick={() => setMobileMenuOpen(false)}>
                    My Trips
                  </NavLink>
                  <NavLink to="/bookings" className={mobileNavClass} onClick={() => setMobileMenuOpen(false)}>
                    My Bookings
                  </NavLink>
                  <NavLink to="/chats" className={mobileNavClass} onClick={() => setMobileMenuOpen(false)}>
                    Chats
                  </NavLink>
                  <NavLink to="/profile" className={mobileNavClass} onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </NavLink>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full px-4 py-2.5 text-[15px] text-left text-red-600 hover:bg-red-50 rounded-2xl transition-colors border-t border-[#e4eef1] mt-1"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={goToSearch} className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-left text-[#054752] hover:bg-[#eef9fe] rounded-2xl transition-colors">
                    <FiSearch className="w-5 h-5 text-[#00AFF5]" /> Search rides
                  </button>
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2.5 text-[15px] text-center text-[#054752] border border-[#c9dde3] rounded-[30px] hover:bg-[#eef9fe] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-4 py-2.5 text-[15px] text-center text-white bg-[#00AFF5] rounded-[30px] hover:bg-[#009ad9] transition-all"
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
