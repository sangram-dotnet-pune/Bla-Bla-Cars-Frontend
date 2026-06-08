import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      navigate("/");
    } catch (err) {
      setMsg("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bb-section py-20">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bb-card"
        onSubmit={handleLogin}
      >
        <h2 className="text-4xl font-extrabold mb-2 text-center text-[#054752]">
          Welcome Back
        </h2>
        <p className="text-center mb-8">Sign in to continue your journey</p>

        {msg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center text-sm">
            {msg}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-[#054752] font-semibold mb-2">Email</label>
          <input
            type="email"
            className="w-full bg-[#F7FBFC] p-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-[#054752] font-semibold mb-2">Password</label>
          <input
            type="password"
            className="w-full bg-[#F7FBFC] p-3"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bb-pill-button bb-button-primary text-lg"
        >
          Sign In
        </motion.button>

        <div className="mt-6 text-center">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-[#00AFF5] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
}

