import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Threads from "../Components/Threads";

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(fullName, phoneNumber, email, password);
      navigate("/login");
    } catch (err) {
      setMsg("Email already exists");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex justify-center items-center">

      {/* 🌌 FULL SCREEN THREADS ANIMATION */}
      <div className="absolute inset-0 h-screen w-full -z-10">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
          style={{ width: "100%", height: "100%" }}   // 🔥 KEY FIX
        />
      </div>
    {/* <div className="flex justify-center items-center min-h-screen bg-gray-100"> */}
      <form
  className="w-96 p-6 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20 text-white"
  onSubmit={handleRegister}
>
  <h2 className="text-3xl font-extrabold mb-5 text-center drop-shadow-lg">
    Register
  </h2>

  <p className="text-red-300 text-center font-medium">{msg}</p>

  <input
    type="text"
    className="w-full bg-white/20 text-white placeholder-white/70 border border-white/30 p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-400"
    placeholder="Full Name"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
  />

  <input
    type="text"
    className="w-full bg-white/20 text-white placeholder-white/70 border border-white/30 p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-400"
    placeholder="Phone Number"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
  />

  <input
    type="email"
    className="w-full bg-white/20 text-white placeholder-white/70 border border-white/30 p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-400"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <input
    type="password"
    className="w-full bg-white/20 text-white placeholder-white/70 border border-white/30 p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-400"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="submit"
    className="w-full bg-green-600/80 hover:bg-green-600 text-white p-3 rounded-lg font-semibold shadow-lg transition"
  >
    Register
  </button>

  <p className="mt-4 text-center text-white/80">
    Already have an account?{" "}
    <span
      className="text-blue-300 font-semibold cursor-pointer hover:underline"
      onClick={() => navigate("/login")}
    >
      Login
    </span>
  </p>
</form>

    </div>
  );
}
