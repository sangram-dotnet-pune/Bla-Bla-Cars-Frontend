import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function UserProfile() {
  const { user } = useAuth();

  if (!user)
    return <div className="text-center text-red-500 mt-20">User not logged in</div>;

  return (
    <div className="relative min-h-screen overflow-hidden flex justify-center items-center p-4 pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 border border-gray-200 overflow-hidden"
      >
        {/* Header gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 -m-8 mb-8"></div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Your Profile</h2>
        <p className="text-gray-600 text-sm text-center mb-8">Manage your account</p>

        <div className="space-y-6 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Full Name</p>
            <p className="text-gray-900 text-lg font-semibold">{user.fullName}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Email</p>
            <p className="text-gray-900 text-lg font-semibold">{user.email}</p>
          </div>
          {user.phoneNumber && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Phone</p>
              <p className="text-gray-900 text-lg font-semibold">{user.phoneNumber}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/edit-profile"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
          >
            Edit Profile
          </Link>

          <Link
            to="/change-password"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
          >
            Change Password
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
