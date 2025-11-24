import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";   // ✅ Import here
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ChangePassword() {
  const navigate = useNavigate();

  const { changePassword } = useAuth();   // ✅ Use inside component

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await changePassword(form.oldPassword, form.newPassword);

      alert("Password changed successfully");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to change password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-lg border border-white/50"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
          Change Password
        </h2>

        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          onChange={handleChange}
          className="input mb-4"
          required
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          onChange={handleChange}
          className="input mb-4"
          required
        />

        <button className="w-full bg-yellow-600 text-white py-2 rounded-xl font-bold hover:bg-yellow-700">
          Update Password
        </button>
      </motion.form>
    </div>
  );
}
