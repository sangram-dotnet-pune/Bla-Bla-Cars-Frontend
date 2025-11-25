import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Threads from "../Components/Threads";

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

    <div className="relative min-h-screen overflow-hidden flex justify-center items-center p-4">

      {/* 🔵 FULLSCREEN THREADS BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>

    {/* <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100"> */}
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-lg border border-white/50"
      >
        <h2 className="text-2xl font-bold text-white/80 mb-4 text-center">
          Edit Profile
        </h2>
      
        <div className="w-full flex flex-col items-center justify-center">

  {/* FULL NAME */}
  <input
    type="text"
    name="fullName"
    value={form.fullName}
    onChange={handleChange}
    className="input mb-4 bg-white/40 rounded-md w-2/3"
    placeholder="Full Name"
    required
  />

  {/* EMAIL */}
  <input
    type="text"
    name="email"
    value={form.email}
    onChange={handleChange}
    className="input mb-4 bg-white/40 rounded-md w-2/3"
    placeholder="Email"
    required
  />

  {/* PHONE NUMBER */}
  <input
    type="text"
    name="phoneNumber"
    value={form.phoneNumber}
    onChange={handleChange}
    className="input mb-4 bg-white/40 rounded-md w-2/3"
    placeholder="Phone Number"
  />

</div>


        <button className="w-full bg-gray-600 text-white py-2 rounded-xl font-bold hover:bg-gray-800">
          Save Changes
        </button>
      </motion.form>
    </div>
  );
}
