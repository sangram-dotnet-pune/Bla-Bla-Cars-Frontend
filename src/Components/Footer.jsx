import { Link } from "react-router-dom";
import { MdDirectionsCar } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bb-nav-surface border-t border-[#d6e4e8] mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-[#054752] hover:opacity-80 transition-opacity">
            <MdDirectionsCar className="w-6 h-6 text-[#00AFF5]" />
            <span>BlaBlaTrips</span>
          </Link>
          <p className="text-sm text-[#708c91] max-w-md mx-auto">
            Affordable, reliable rides. Share the journey, split the cost.
          </p>
        </div>
      </div>
    </footer>
  );
}
