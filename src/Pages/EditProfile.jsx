import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiArrowRight } from "react-icons/fi";

export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user.fullName,
    phoneNumber: user.phoneNumber || "",
    email: user.email,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(form.fullName, form.phoneNumber, form.email);
      alert("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex justify-center items-center p-4 pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 border border-gray-200 overflow-hidden"
      >
        {/* Header gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 -m-8 mb-8"></div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Edit Profile
        </h2>
        <p className="text-gray-600 text-sm text-center mb-8">
          Update your information
        </p>

        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Save Changes</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
