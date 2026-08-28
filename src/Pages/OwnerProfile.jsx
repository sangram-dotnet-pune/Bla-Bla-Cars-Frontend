import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/apiClient";
import { getUserReviews } from "../api/reviewApi";
import StarRating from "../Components/StarRating";
import ReviewCard from "../Components/ReviewCard";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiInfo,
  FiArrowLeft,
  FiStar,
  FiShield,
} from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";

const sectionCardClass =
  "bg-white rounded-3xl bb-elevation-soft border border-[#e4eef1] overflow-hidden";

export default function OwnerProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  // Reviews
  const [reviews, setReviews] = useState(null); // { averageRating, totalReviews, reviews[] }
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        setError("Owner not found.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`/auth/me/${userId}`);
        const data = res.data?.user || res.data || {};
        setProfile(data);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "This owner could not be found."
            : "Failed to load owner profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    const loadReviews = async () => {
      if (!userId) return;
      setReviewsLoading(true);
      setReviewsError(false);
      try {
        const data = await getUserReviews(userId);
        setReviews(data);
      } catch {
        setReviewsError(true);
      } finally {
        setReviewsLoading(false);
      }
    };

    load();
    loadReviews();
  }, [userId]);

  const name = profile?.fullName || "Trip Owner";
  const vehicle = profile?.vehicle || {};

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#eef9fe] via-white to-[#eef9fe]">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#054752] bg-white border border-[#c9dde3] rounded-xl px-4 py-2 hover:bg-[#eef9fe] transition-colors"
        >
          <FiArrowLeft /> Back
        </button>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading owner profile...</div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">👤</p>
            <p className="text-gray-600 font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <div className="relative inline-flex mb-4">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#00AFF5] text-white text-4xl font-bold shadow-lg">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00b2e3] rounded-full flex items-center justify-center">
                  <FiShield className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-[#054752]">{name}</h1>
              <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-500">
                <FiStar className="text-yellow-400" />
                {reviewsLoading ? (
                  <span className="font-semibold text-[#054752]">…</span>
                ) : reviews && reviews.totalReviews > 0 ? (
                  <>
                    <span className="font-semibold text-[#054752]">
                      {Number(reviews.averageRating).toFixed(1)}
                    </span>
                    <span>({reviews.totalReviews} review{reviews.totalReviews > 1 ? "s" : ""})</span>
                  </>
                ) : (
                  <span className="font-semibold text-[#054752]">No reviews yet</span>
                )}
              </div>
            </motion.div>

            {/* Personal Details */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={sectionCardClass}
            >
              <div className="px-6 py-4 border-b border-[#e4eef1]">
                <h2 className="text-lg font-bold text-[#054752] flex items-center gap-2">
                  <FiUser className="text-[#00AFF5]" /> Personal Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <InfoRow icon={<FiUser />} label="Full Name" value={name} />
                <InfoRow icon={<FiMail />} label="Email" value={profile?.email} />
                <InfoRow icon={<FiPhone />} label="Phone" value={profile?.phoneNumber} />
              </div>
            </motion.section>

            {/* About */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className={sectionCardClass}
            >
              <div className="px-6 py-4 border-b border-[#e4eef1]">
                <h2 className="text-lg font-bold text-[#054752] flex items-center gap-2">
                  <FiInfo className="text-[#00AFF5]" /> About
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-[#f7fbfd] rounded-2xl p-4">
                  <p className="text-[12px] font-semibold text-[#5c828a] uppercase tracking-wide mb-1">
                    Mini Bio
                  </p>
                  <p className="text-[15px] text-[#054752]">
                    {profile?.miniBio || "No bio added yet."}
                  </p>
                </div>
                <div className="bg-[#f7fbfd] rounded-2xl p-4">
                  <p className="text-[12px] font-semibold text-[#5c828a] uppercase tracking-wide mb-1">
                    Travel Preferences
                  </p>
                  <p className="text-[15px] text-[#054752]">
                    {profile?.travelPreferences || "No preferences set."}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Vehicle */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={sectionCardClass}
            >
              <div className="px-6 py-4 border-b border-[#e4eef1]">
                <h2 className="text-lg font-bold text-[#054752] flex items-center gap-2">
                  <MdDirectionsCar className="text-[#00AFF5]" /> Vehicle
                </h2>
              </div>
              <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <VehicleInfo label="Make" value={vehicle.make || profile?.make} />
                <VehicleInfo label="Model" value={vehicle.model || profile?.model} />
                <VehicleInfo label="Year" value={vehicle.year || profile?.year} />
                <VehicleInfo label="Color" value={vehicle.color || profile?.color} />
                <div className="col-span-2 sm:col-span-3">
                  <div className="bg-[#f7fbfd] rounded-2xl p-4">
                    <p className="text-[12px] font-semibold text-[#5c828a] uppercase tracking-wide mb-1">
                      License Plate
                    </p>
                    <p className="text-[15px] font-semibold text-[#054752]">
                      {vehicle.licensePlate || profile?.licensePlate || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Reviews */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={sectionCardClass}
            >
              <div className="px-6 py-4 border-b border-[#e4eef1]">
                <h2 className="text-lg font-bold text-[#054752] flex items-center gap-2">
                  <FiStar className="text-[#F5B301]" /> Reviews
                </h2>
              </div>
              <div className="p-6">
                {reviewsLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading reviews...</div>
                ) : reviewsError ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Failed to load reviews. Please try again.</p>
                  </div>
                ) : !reviews || reviews.totalReviews === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">⭐</div>
                    <p className="text-gray-500 font-medium">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-[#f7fbfd] rounded-2xl p-4">
                      <div className="text-4xl font-extrabold text-[#054752]">
                        {Number(reviews.averageRating).toFixed(1)}
                      </div>
                      <div>
                        <StarRating value={Math.round(reviews.averageRating)} size="w-5 h-5" />
                        <p className="text-sm text-[#5c828a] mt-0.5">
                          {reviews.totalReviews} review{reviews.totalReviews > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    {(reviews.reviews || []).map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </div>
            </motion.section>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-[#f7fbfd] rounded-2xl p-4">
      <div className="w-10 h-10 rounded-full bg-[#eef9fe] flex items-center justify-center text-[#00AFF5] shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-[#5c828a] uppercase tracking-wide">
          {label}
        </p>
        <p className="text-[15px] font-semibold text-[#054752] truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function VehicleInfo({ label, value }) {
  return (
    <div className="bg-[#f7fbfd] rounded-2xl p-4">
      <p className="text-[12px] font-semibold text-[#5c828a] uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-[15px] font-semibold text-[#054752]">{value || "—"}</p>
    </div>
  );
}
