import { useState } from "react";
import { FiStar } from "react-icons/fi";

export default function StarRating({
  value = 0,
  onChange,
  size = "w-8 h-8",
  ariaLabel = "Rating",
}) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === "function";
  const active = interactive ? hover || value : value;

  const handleKeyDown = (e) => {
    if (!interactive) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(5, (value || 0) + 1);
      onChange(next);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(1, (value || 0) - 1);
      onChange(next);
    } else if (e.key === "Enter" || e.key === " " || e.key === "Home") {
      e.preventDefault();
      onChange(Math.max(1, active || 1));
    }
  };

  return (
    <div
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? `${ariaLabel} (1 to 5 stars)` : undefined}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => interactive && setHover(0)}
      className="inline-flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= active;
        const StarTag = interactive ? "button" : "span";
        return (
          <StarTag
            key={star}
            type={interactive ? "button" : undefined}
            role={interactive ? "radio" : "img"}
            aria-checked={interactive ? value === star : undefined}
            aria-label={interactive ? `${star} out of 5 stars` : `${active} out of 5 stars`}
            aria-hidden={interactive ? false : true}
            onClick={interactive ? () => onChange(star) : undefined}
            onMouseEnter={interactive ? () => setHover(star) : undefined}
            onFocus={interactive ? () => setHover(star) : undefined}
            tabIndex={interactive ? (star === 1 ? 0 : -1) : undefined}
            className={interactive ? "transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#00AFF5]/40 rounded" : undefined}
          >
            <FiStar
              className={`${interactive ? "cursor-pointer" : ""} ${size} ${
                filled ? "fill-[#F5B301] text-[#F5B301]" : "text-gray-300"
              } transition-colors`}
            />
          </StarTag>
        );
      })}
    </div>
  );
}
