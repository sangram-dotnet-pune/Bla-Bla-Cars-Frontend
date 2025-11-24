import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user.fullName,
    phoneNumber: user.phoneNumber || "",
    email:user.email
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(form.fullName, form.phoneNumber,form.email);

      alert("Profile updated successfully");
      navigate("/profile");

    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
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
          Edit Profile
        </h2>

        {/* FULL NAME */}
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          className="input mb-4"
          placeholder="Full Name"
          required
        />

        <input
  type="text"
  name="email"
  value={form.email}
  onChange={handleChange}
  className="input mb-4"
  placeholder="Email"
  required
/>


        {/* PHONE NUMBER */}
        <input
          type="text"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          className="input mb-4"
          placeholder="Phone Number"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700">
          Save Changes
        </button>
      </motion.form>
    </div>
  );
}
