import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import StarRating from "./StarRating";

const computeTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  const ms = Date.now() - new Date(dateStr).getTime();
  if (ms < 0) return "";
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

export default function ReviewCard({ review }) {
  const name = review?.reviewer?.name || "Anonymous";
  const avatar = review?.reviewer?.avatar || null;
  const rating = review?.rating || 0;

  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeAgo(computeTimeAgo(review?.createdAt));
  }, [review?.createdAt]);

  return (
    <div className="flex items-start gap-4 bg-[#f7fbfd] rounded-2xl p-4">
      <div className="w-10 h-10 rounded-full bg-[#eef9fe] shrink-0 overflow-hidden flex items-center justify-center text-[#00AFF5]">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <FiUser className="w-5 h-5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="font-bold text-[#054752] text-[15px]">{name}</p>
          <span className="text-xs text-[#8aacb1]">{timeAgo}</span>
        </div>
        <div className="mt-0.5">
          <StarRating value={rating} size="w-4 h-4" />
        </div>
        {review.comment && (
          <p className="mt-2 text-[15px] text-[#3f5d64] leading-relaxed">{review.comment}</p>
        )}
      </div>
    </div>
  );
}
