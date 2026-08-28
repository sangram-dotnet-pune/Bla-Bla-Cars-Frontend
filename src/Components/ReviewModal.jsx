import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import StarRating from "./StarRating";

export default function ReviewModal({
  open,
  onClose,
  title = "Leave a review",
  subtitle = "How was your experience?",
  onSubmit,
  submitting = false,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (rating < 1) {
      setError("Please select a rating from 1 to 5 stars.");
      return;
    }
    onSubmit(rating, comment);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#e4eef1] p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close review dialog"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>

            <h3 className="text-2xl font-extrabold text-[#054752] mb-1">{title}</h3>
            <p className="text-[#5c828a] text-[15px] mb-6">{subtitle}</p>

            <div className="text-center mb-6">
              <StarRating value={rating} onChange={setRating} ariaLabel={title} />
              <p className="mt-3 text-sm font-semibold text-[#054752]">
                Your rating: {rating}/5
              </p>
            </div>

            <label className="block text-[13px] font-semibold text-[#054752] mb-1.5">
              Comment <span className="text-[#9db7bd] font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              maxLength={1000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full px-4 py-2.5 text-[15px] text-[#054752] bg-white border border-[#c9dde3] rounded-xl placeholder:text-[#9db7bd] focus:outline-none focus:border-[#00AFF5] focus:ring-2 focus:ring-[#00AFF5]/20 transition-all"
            />

            {error && (
              <p className="mt-3 text-[13px] font-semibold text-red-600">{error}</p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 rounded-full border border-[#c9dde3] text-sm font-semibold text-[#054752] hover:bg-[#eef9fe] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2.5 rounded-full bg-[#00AFF5] hover:bg-[#009ad9] text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
