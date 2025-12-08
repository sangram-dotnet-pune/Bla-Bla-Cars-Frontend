import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { changePassword } = useAuth();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await changePassword(form.oldPassword, form.newPassword);
      alert("Password changed successfully");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to change password");
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
          Change Password
        </h2>
        <p className="text-gray-600 text-sm text-center mb-8">
          Keep your account secure
        </p>

        <div className="space-y-5">
          {/* Old Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showOldPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNewPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type={showNewPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNewPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
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
                <span>Updating...</span>
              </>
            ) : (
              <>
                <span>Update Password</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
