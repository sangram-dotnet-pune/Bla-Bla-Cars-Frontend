import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./navbar.css";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="glass-navbar dark px-6 py-3 flex justify-between items-center">

      {/* 🔷 Logo */}
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-wide glass-link"
        style={{ letterSpacing: "1px" }}
      >
        BlaBlaTrips
      </Link>

      {/* 🔹 Right Side */}
      <div className="flex items-center gap-5">

        {/* 🌐 Publish Rides Button */}
        {user && (
          <Link
            to="/create-trip"
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white
                       backdrop-blur-md shadow-lg hover:bg-white/20 transition-all duration-300
                       hover:shadow-[0_0_12px_rgba(68,237,217,0.6)]"
          >
            Publish Ride
          </Link>
        )}

        {/* 🌐 Login / Register */}
        {!user && (
          <>
            <Link className="glass-link" to="/login">
              Login
            </Link>

            <Link className="glass-link" to="/register">
              Register
            </Link>
          </>
        )}

        {/* 🌟 Hi, User */}
        {user && (
          <div
            className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20
                       backdrop-blur-xl text-white font-semibold shadow 
                       hover:shadow-[0_0_15px_rgba(68,237,217,0.7)]
                       transition-all duration-300">
            Hi, {user.fullName}
          </div>
        )}

        {/* 🌐 Profile Button */}
        {user && (
          <Link
            to="/profile"
            className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold 
                       border border-white/20 hover:bg-white/30 transition-all shadow"
          >
            Profile
          </Link>
        )}

        {/* 🔴 Logout */}
        {user && (
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-semibold
                       hover:bg-red-700 transition-all shadow"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
