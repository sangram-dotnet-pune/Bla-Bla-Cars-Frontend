import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Threads from "../Components/Threads";

export default function UserProfile() {
  const { user } = useAuth();

  if (!user)
    return <div className="text-center text-red-500 mt-20">User not logged in</div>;

  return (
    <div className="relative min-h-screen overflow-hidden flex justify-center items-center p-4">

      {/* 🔵 FULLSCREEN THREADS BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>
    {/* <div className="min-h-screen p-6 flex justify-center items-center bg-gray-100 dark:bg-gray-900"> */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-lg border border-white/50"
      >
        <h2 className="text-3xl font-bold text-white/80 mb-6 text-center">Your Profile</h2>

        <div className="space-y-4 text-lg">
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.phoneNumber && (
            <p><strong>Phone:</strong> {user.phoneNumber}</p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <Link
            to="/edit-profile"
            className="bg-gray-700 text-white py-2 rounded-xl text-center font-semibold shadow hover:bg-gray-900 transition"
          >
            Edit Profile
          </Link>

          <Link
            to="/change-password"
            className="bg-gray-700 text-white py-2 rounded-xl text-center font-semibold shadow hover:bg-gray-900 transition"
          >
            Change Password
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
