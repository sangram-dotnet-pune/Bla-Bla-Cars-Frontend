import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiShield,
  FiClock,
  FiMessageCircle,
  FiSearch,
} from "react-icons/fi";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = Boolean(user?.userId || user?.id || user?.email);

  const features = [
    {
      icon: <FiMapPin className="w-8 h-8" />,
      title: "Find Rides Anywhere",
      description: "Connect with drivers heading your way. Save money, travel smart.",
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Build Community",
      description: "Meet new people and share your journey with friendly co-travelers.",
    },
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      title: "Save Money",
      description: "Split costs and make travel affordable for everyone.",
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Safe & Secure",
      description: "Verified profiles and secure payments keep you protected.",
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: "Flexible Timing",
      description: "Find rides that match your schedule, anytime, anywhere.",
    },
    {
      icon: <FiMessageCircle className="w-8 h-8" />,
      title: "Easy Communication",
      description: "Chat directly with drivers and passengers in real-time.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Rides Completed" },
    { number: "100+", label: "Cities Covered" },
    { number: "4.8*", label: "Average Rating" },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFF5]/10 via-transparent to-[#054752]/10" />
        <div className="max-w-7xl mx-auto bb-section pt-20 md:pt-28 pb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
              Your Journey, <br />
              <span className="text-[#00AFF5]">Shared & Smart</span>
            </h1>
            <p className="text-lg md:text-2xl text-[#708C91] mb-10 leading-relaxed">
              Connect with travelers going your way. Save money, make friends, and travel
              sustainably.
            </p>

            <div className="bb-search-shell max-w-6xl mx-auto mb-8 text-left">
              <div className="bb-search-segment">
                <FiMapPin className="w-5 h-5 text-[#00AFF5]" />
                <div>
                  <label>Leaving from</label>
                  <p>Choose departure city</p>
                </div>
              </div>
              <div className="bb-search-divider" />
              <div className="bb-search-segment">
                <FiMapPin className="w-5 h-5 text-[#00AFF5]" />
                <div>
                  <label>Going to</label>
                  <p>Select destination</p>
                </div>
              </div>
              <div className="bb-search-divider" />
              <div className="bb-search-segment">
                <FiClock className="w-5 h-5 text-[#00AFF5]" />
                <div>
                  <label>When</label>
                  <p>Pick a travel date</p>
                </div>
              </div>
              <div className="bb-search-divider" />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/trips")}
                className="bb-pill-button bb-button-primary w-full md:w-auto flex items-center justify-center gap-2"
              >
                <FiSearch className="w-4 h-4" />
                Search rides
              </motion.button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="bb-pill-button bb-button-primary text-lg"
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="bb-pill-button bb-button-secondary text-lg"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bb-card backdrop-blur-sm p-6">
                <div className="text-[#00AFF5] font-bold text-lg mb-2">Offer a Ride</div>
                <p>Share your empty seats and earn while you drive</p>
              </div>
              <div className="bb-card backdrop-blur-sm p-6">
                <div className="text-[#00AFF5] font-bold text-lg mb-2">Book a Seat</div>
                <p>Find affordable rides to your destination</p>
              </div>
              <div className="bb-card backdrop-blur-sm p-6">
                <div className="text-[#00AFF5] font-bold text-lg mb-2">Chat & Connect</div>
                <p>Coordinate easily with fellow travelers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-[#054752] py-16">
        <div className="max-w-7xl mx-auto bb-section">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-extrabold text-white mb-2">{stat.number}</div>
                <div className="text-[#C7E4ED] font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 max-w-7xl mx-auto bb-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-extrabold mb-4">Why Choose Bla Bla Cars?</h2>
          <p className="text-xl">Everything you need for a seamless carpooling experience</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className="bb-card p-8 transition-all"
            >
              <div className="bg-[#00AFF5] text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-[#F3FAFC] py-20">
        <div className="max-w-7xl mx-auto bb-section">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-extrabold mb-4">How It Works</h2>
            <p className="text-xl">Get started in 3 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Create Account", desc: "Sign up in seconds with your email" },
              { step: "2", title: "Find or Offer Ride", desc: "Search for rides or publish your own" },
              { step: "3", title: "Travel Together", desc: "Meet, chat, and enjoy the journey" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-[#00AFF5] text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold mx-auto mb-6 bb-elevation-soft">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="py-20 bg-[#054752]">
          <div className="max-w-7xl mx-auto bb-section text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-extrabold text-white mb-6">Ready to Start Your Journey?</h2>
              <p className="text-xl text-[#C7E4ED] mb-10 max-w-2xl mx-auto">
                Join thousands of travelers who are saving money and making new connections every day.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="bb-pill-button bg-white text-[#054752] text-xl font-extrabold"
              >
                Join Bla Bla Cars Now
              </motion.button>
            </motion.div>
          </div>
        </div>
      )}

      <div className="bg-[#043741] text-white py-12">
        <div className="max-w-7xl mx-auto bb-section text-center">
          <p className="text-[#A6C2C9]">© 2025 Bla Bla Cars. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
