import { motion } from "framer-motion";

export default function CarAnimation() {
  const orbitWheel = {
    animate: { rotate: -360 },
    transition: { duration: 1.2, repeat: Infinity, ease: "linear" },
  };

  const dashX = {
    animate: { x: [0, -40] },
    transition: { duration: 0.8, repeat: Infinity, ease: "linear" },
  };

  return (
    <div className="relative mx-auto max-w-4xl select-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* cloud */}
        <motion.div
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 right-4 text-white/70"
        >
          <svg width="90" height="40" viewBox="0 0 100 40" fill="currentColor">
            <ellipse cx="30" cy="28" rx="22" ry="12" />
            <ellipse cx="55" cy="22" rx="24" ry="15" />
            <ellipse cx="80" cy="28" rx="20" ry="11" />
          </svg>
        </motion.div>
      </motion.div>

      {/* bobbing car */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto w-[320px] sm:w-[440px]"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 220 110" fill="none" className="w-full drop-shadow-[0_16px_24px_rgba(0,0,0,0.35)]">
            {/* lower body */}
            <path
              d="M20 70 L25 55 Q26 48 33 47 L52 42 Q58 39 62 33 L72 20 Q77 14 85 14 L135 14 Q143 14 148 20 L158 33 Q162 39 168 42 L187 47 Q194 48 195 55 L200 72 L20 70 Z"
              fill="#00AFF5"
            />
            {/* windows */}
            <path
              d="M70 22 L78 36 Q82 42 88 43 L132 43 Q138 42 142 36 L150 22 Z"
              fill="#0B3A44"
            />
            <path d="M86 22 L92 40 L130 40 L136 22 Z" fill="#C9EFFF" opacity="0.85" />
            {/* door line */}
            <path d="M110 46 L110 66" stroke="#009AD9" strokeWidth="2.5" strokeLinecap="round" />
            {/* headlight */}
            <circle cx="196" cy="62" r="7" fill="#FFF9C4">
              <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
            </circle>
            {/* taillight */}
            <rect x="18" y="58" width="7" height="8" rx="2" fill="#FF5C5C" />

            {/* wheels */}
            <g transform="translate(52 74) rotate(0)">
              <motion.g {...orbitWheel}>
                <circle r="17" fill="#0B1F26" />
                <circle r="10" fill="#2E4A52" />
                <circle r="4" fill="#7FD8F0" />
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#7FD8F0" strokeWidth="2" />
                <line x1="0" y1="-12" x2="0" y2="12" stroke="#7FD8F0" strokeWidth="2" />
              </motion.g>
            </g>
            <g transform="translate(168 74)">
              <motion.g {...orbitWheel}>
                <circle r="17" fill="#0B1F26" />
                <circle r="10" fill="#2E4A52" />
                <circle r="4" fill="#7FD8F0" />
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#7FD8F0" strokeWidth="2" />
                <line x1="0" y1="-12" x2="0" y2="12" stroke="#7FD8F0" strokeWidth="2" />
              </motion.g>
            </g>
          </svg>
        </motion.div>
      </motion.div>

      {/* road */}
      <div className="mt-[-6px] flex items-end gap-3 justify-center">
        <div className="relative w-full max-w-3xl h-10 rounded-full bg-[#0B3A44] overflow-hidden">
          <motion.div
            {...dashX}
            className="absolute top-1/2 left-0 w-[120px] flex justify-between -translate-y-1/2"
          >
            <span className="h-1.5 w-4 bg-[#C7E4ED] rounded" />
            <span className="h-1.5 w-4 bg-[#C7E4ED] rounded" />
            <span className="h-1.5 w-4 bg-[#C7E4ED] rounded" />
            <span className="h-1.5 w-4 bg-[#C7E4ED] rounded" />
            <span className="h-1.5 w-4 bg-[#C7E4ED] rounded" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
