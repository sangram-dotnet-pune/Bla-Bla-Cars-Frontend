import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiUsers, FiDollarSign, FiShield, FiClock, FiMessageCircle } from "react-icons/fi";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiMapPin className="w-8 h-8" />,
      title: "Find Rides Anywhere",
      description: "Connect with drivers heading your way. Save money, travel smart."
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Build Community",
      description: "Meet new people and share your journey with friendly co-travelers."
    },
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      title: "Save Money",
      description: "Split costs and make travel affordable for everyone."
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Safe & Secure",
      description: "Verified profiles and secure payments keep you protected."
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: "Flexible Timing",
      description: "Find rides that match your schedule, anytime, anywhere."
    },
    {
      icon: <FiMessageCircle className="w-8 h-8" />,
      title: "Easy Communication",
      description: "Chat directly with drivers and passengers in real-time."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Rides Completed" },
    { number: "100+", label: "Cities Covered" },
    { number: "4.8★", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
        
        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6">
              Your Journey, <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Shared & Smart
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
              Connect with travelers going your way. Save money, make friends, and travel sustainably.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all"
              >
                Get Started Free
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-full shadow-lg hover:shadow-xl border-2 border-gray-200 transition-all"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>

          {/* Floating Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-blue-600 font-bold text-lg mb-2">🚗 Offer a Ride</div>
                <p className="text-gray-600">Share your empty seats and earn while you drive</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-purple-600 font-bold text-lg mb-2">🎫 Book a Seat</div>
                <p className="text-gray-600">Find affordable rides to your destination</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-green-600 font-bold text-lg mb-2">💬 Chat & Connect</div>
                <p className="text-gray-600">Coordinate easily with fellow travelers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4">
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
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
            Why Choose Bla Bla Cars?
          </h2>
          <p className="text-xl text-gray-600">Everything you need for a seamless carpooling experience</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all"
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Get started in 3 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Create Account", desc: "Sign up in seconds with your email" },
              { step: "2", title: "Find or Offer Ride", desc: "Search for rides or publish your own" },
              { step: "3", title: "Travel Together", desc: "Meet, chat, and enjoy the journey" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold mx-auto mb-6 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-extrabold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of travelers who are saving money and making new connections every day.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="px-10 py-5 bg-white text-blue-600 font-extrabold text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all"
            >
              Join Bla Bla Cars Now
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 Bla Bla Cars. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
