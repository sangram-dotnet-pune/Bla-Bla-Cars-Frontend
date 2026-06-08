import { useState, useMemo } from "react";
import useTrips from "../Hooks/useTrips";
import TripCard from "../Components/TripCard";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";
import { MdOutlineDirectionsWalk } from "react-icons/md";
import { PiHourglass } from "react-icons/pi";

const SORT_OPTIONS = [
  { value: "earliest", label: "Earliest departure", icon: <FiClock className="w-5 h-5" /> },
  { value: "price", label: "Lowest price", icon: <FiDollarSign className="w-5 h-5" /> },
  {
    value: "departure",
    label: "Close to departure point",
    icon: <MdOutlineDirectionsWalk className="w-5 h-5 text-white bg-green-500 rounded-full p-0.5" />,
  },
  {
    value: "arrival",
    label: "Close to arrival point",
    icon: <MdOutlineDirectionsWalk className="w-5 h-5 text-white bg-green-500 rounded-full p-0.5" />,
  },
  { value: "shortest", label: "Shortest ride", icon: <PiHourglass className="w-5 h-5" /> },
];

const TIME_SLOTS = [
  { label: "Before 06:00", key: "before6", test: (h) => h < 6 },
  { label: "06:00 - 12:00", key: "6to12", test: (h) => h >= 6 && h < 12 },
  { label: "12:01 - 18:00", key: "12to18", test: (h) => h >= 12 && h < 18 },
  { label: "After 18:00", key: "after18", test: (h) => h >= 18 },
];

export default function Trips() {
  const { trips, loading, error, refresh } = useTrips();
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [sortBy, setSortBy] = useState("earliest");
  const [timeFilters, setTimeFilters] = useState([]);

  const toggleTime = (key) =>
    setTimeFilters((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const filtered = useMemo(() => {
    let result = trips.filter((t) => {
      const matchFrom = t.startLocation.toLowerCase().includes(searchFrom.toLowerCase());
      const matchTo = t.endLocation.toLowerCase().includes(searchTo.toLowerCase());
      return matchFrom && matchTo;
    });

    if (timeFilters.length > 0) {
      result = result.filter((t) => {
        const h = new Date(t.departureTime).getHours();
        return timeFilters.some((key) => TIME_SLOTS.find((s) => s.key === key)?.test(h));
      });
    }

    return [...result].sort((a, b) => {
      if (sortBy === "price") return a.pricePerSeat - b.pricePerSeat;
      if (sortBy === "earliest") return new Date(a.departureTime) - new Date(b.departureTime);
      return 0;
    });
  }, [trips, searchFrom, searchTo, sortBy, timeFilters]);

  const slotCounts = useMemo(
    () =>
      TIME_SLOTS.reduce((acc, slot) => {
        acc[slot.key] = trips.filter((t) => slot.test(new Date(t.departureTime).getHours())).length;
        return acc;
      }, {}),
    [trips]
  );

  return (
    <div className="min-h-screen pt-[72px] bg-[#f1f4f5]">
     <div className="bg-white border-b border-[#e4eef1] px-4 sm:px-6 lg:px-8 py-4">
  <div className="max-w-7xl mx-auto">

    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center w-full border-2 border-[#00AFF5] rounded-xl bg-white overflow-hidden"
    >
      {/* Leaving From */}
      <div className="flex items-center gap-2 flex-1 px-5 py-4 border-r border-[#e4eef1]">
        <FiMapPin className="w-5 h-5 text-[#00AFF5] shrink-0" />
        <input
          type="text"
          placeholder="Leaving from"
          value={searchFrom}
          onChange={(e) => setSearchFrom(e.target.value)}
          className="w-full bg-transparent text-[15px] font-semibold text-[#0d2b36] placeholder:text-[#aac4cc] placeholder:font-medium leading-none appearance-none !border-0 !outline-none !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none"
        />
      </div>

      {/* Going To */}
      <div className="flex items-center gap-2 flex-1 px-5 py-4 border-r border-[#e4eef1]">
        <FiMapPin className="w-5 h-5 text-[#00AFF5] shrink-0" />
        <input
          type="text"
          placeholder="Going to"
          value={searchTo}
          onChange={(e) => setSearchTo(e.target.value)}
          className="w-full bg-transparent text-[15px] font-semibold text-[#0d2b36] placeholder:text-[#aac4cc] placeholder:font-medium leading-none appearance-none !border-0 !outline-none !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none"
        />
      </div>

      {/* Search Button */}
      <motion.button
        onClick={refresh}
        whileTap={{ scale: 0.97 }}
        disabled={loading}
        className="shrink-0 bg-[#00AFF5] hover:bg-[#009de0] text-white font-bold text-[15px] px-10 py-4 rounded-r-xl transition-colors flex items-center gap-2 disabled:opacity-60"
      >
        {loading ? (
          <>
            <FiRefreshCw className="w-4 h-4 animate-spin" /> Loading...
          </>
        ) : (
          "Search"
        )}
      </motion.button>
    </motion.div>

  </div>
</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 items-start">
        <aside className="hidden lg:block w-[260px] shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-[#e4eef1] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[17px] font-extrabold text-[#0d2b36]">Sort by</h3>
              <button onClick={() => setSortBy("earliest")} className="text-[13px] font-semibold text-[#00AFF5] hover:underline">
                Clear all
              </button>
            </div>
            <div className="space-y-0.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className="w-full flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-[#f1f4f5] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        sortBy === opt.value ? "border-[#00AFF5] bg-[#00AFF5]" : "border-[#aac4cc]"
                      }`}
                    >
                      {sortBy === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className={`text-[14px] font-semibold text-left ${sortBy === opt.value ? "text-[#0d2b36]" : "text-[#4a6b75]"}`}>
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-[#aac4cc]">{opt.icon}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e4eef1] p-5">
            <h3 className="text-[17px] font-extrabold text-[#0d2b36] mb-3">Departure time</h3>
            <div className="space-y-0.5">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.key}
                  onClick={() => toggleTime(slot.key)}
                  className="w-full flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-[#f1f4f5] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        timeFilters.includes(slot.key) ? "border-[#00AFF5] bg-[#00AFF5]" : "border-[#aac4cc]"
                      }`}
                    >
                      {timeFilters.includes(slot.key) && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[14px] font-semibold ${timeFilters.includes(slot.key) ? "text-[#0d2b36]" : "text-[#4a6b75]"}`}>
                      {slot.label}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold text-[#aac4cc]">{slotCounts[slot.key] || 0}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 font-semibold mb-4">
              {typeof error === "string" ? error : "Failed to load trips."}
            </div>
          )}

          {!loading && (
            <p className="text-[14px] font-semibold text-[#6b8fa0] mb-3">
              <span className="text-[#0d2b36] font-extrabold text-[16px]">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "trip" : "trips"} found
            </p>
          )}

          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={`sk-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl border border-[#e4eef1] p-6 animate-pulse"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-[#e8f0f2] rounded-full w-1/3" />
                        <div className="h-4 bg-[#e8f0f2] rounded-full w-1/4" />
                      </div>
                      <div className="h-7 bg-[#e8f0f2] rounded-full w-24" />
                    </div>
                    <div className="h-px bg-[#e8f0f2] mb-4" />
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#e8f0f2]" />
                      <div className="h-4 bg-[#e8f0f2] rounded-full w-28" />
                    </div>
                  </motion.div>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((trip, i) => (
                  <motion.div
                    key={trip.tripId ?? i}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.04 }}
                    layout
                  >
                    <TripCard trip={trip} />
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <div className="text-6xl mb-4">🚗</div>
                  <h3 className="text-2xl font-bold text-[#054752] mb-2">No Trips Found</h3>
                  <p className="text-[#8aacb1]">Try adjusting your search or filters.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
