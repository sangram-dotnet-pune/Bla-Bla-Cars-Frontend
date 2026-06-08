import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin, FiUsers, FiChevronRight, FiChevronLeft,
  FiPlus, FiMinus, FiX, FiMessageSquare, FiCheck,
} from "react-icons/fi";

const TOTAL_STEPS = 6;

const SLIDE = {
  initial:    (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  animate:    { x: 0, opacity: 1 },
  exit:       (dir) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0 }),
  transition: { type: "spring", stiffness: 320, damping: 32 },
};

function StepDots({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i + 1 === step ? 28 : 8,
            backgroundColor: i + 1 <= step ? "#00aff5" : "#d1dde0",
          }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}

function ContinueBtn({ label = "Continue", onClick, disabled, loading }) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center gap-2 px-10 py-3.5 rounded-full text-[17px] font-bold text-white min-w-[160px] justify-center transition-colors
        ${disabled || loading ? "bg-[#b0cdd4] cursor-not-allowed" : "bg-[#00aff5] cursor-pointer"}`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block animate-spin" />
      )}
      {label}
    </motion.button>
  );
}

function BackBtn({ onClick }) {
  return (
    <motion.button
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-1.5 text-[#054752] font-semibold text-[15px] cursor-pointer py-2 bg-transparent border-none"
    >
      <FiChevronLeft size={20} /> Back
    </motion.button>
  );
}

// ─── STEP 1 — Route ───────────────────────────────────────────────────────────
function Step1({ data, onChange, onNext }) {
  return (
    <div className="flex flex-col items-center">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#e8f8fe] to-[#cdf0fd] rounded-[2rem] p-10 pb-7 max-w-[520px] w-full text-center mb-7"
      >
        <motion.div
          animate={{ x: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="text-6xl mb-4"
        >
          🚗
        </motion.div>
        <h1 className="text-[#054752] font-black text-2xl m-0 mb-2">
          Become a BlaBlaCar driver and save on travel costs by sharing your ride.
        </h1>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 font-extrabold text-[15px] text-[#054752] shadow-[0_4px_16px_rgba(0,175,245,0.18)] mt-4"
        >
          <span className="text-[#00aff5]">✦</span>
          Save up to <span className="text-[#00aff5] text-[18px]">₹1,624</span> on your first ride
        </motion.div>
      </motion.div>

      {/* Input card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[2rem] px-8 py-7 max-w-[520px] w-full shadow-[0_8px_40px_rgba(5,71,82,0.10)]"
      >
      {/* From */}
<div className="flex items-center gap-3 py-3 px-4 border-2 border-[#00aff5] rounded-xl focus-within:border-[#00aff5]">
  <span className="text-[#00aff5] text-xl">
    <FiMapPin />
  </span>

  <div className="flex flex-col w-full">
    <div className="text-[11px] font-bold text-[#8aacb1] uppercase tracking-widest">
      Leaving from
    </div>

    <input
      value={data.startLocation}
      onChange={(e) => onChange("startLocation", e.target.value)}
      placeholder="e.g. Delhi"
      className="appearance-none !border-0 !outline-none !ring-0 !shadow-none text-base font-bold text-[#054752] bg-transparent w-full placeholder:text-[#c5d8dc] focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none"
    />
  </div>
</div>

        {/* To */}
        <div className="flex items-center gap-3 py-3 px-4 mt-3 border-2 border-[#00aff5] rounded-xl focus-within:border-[#00aff5]">
          <span className="text-[#00aff5] text-xl"><FiMapPin /></span>
          <div className="flex flex-col w-full">
            <div className="text-[11px] font-bold text-[#8aacb1] uppercase tracking-widest">
              Going to
            </div>
            <input
              value={data.endLocation}
              onChange={(e) => onChange("endLocation", e.target.value)}
              placeholder="e.g. Jaipur"
              className="appearance-none !border-0 !outline-none !ring-0 !shadow-none text-base font-bold text-[#054752] bg-transparent w-full placeholder:text-[#c5d8dc] focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none"
            />
          </div>
        </div>

        <div className="h-px bg-[#e8f0f2]" />

        {/* Available Seats */}
        <div className="flex items-center gap-3 py-3">
          <span className="text-[#00aff5] text-xl"><FiUsers /></span>
          <div className="flex-1">
            <div className="text-[11px] font-bold text-[#8aacb1] uppercase tracking-widest mb-2">
              Available Seats
            </div>
            <div className="flex gap-2.5">
              {[1, 2, 3, 4].map((n) => (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onChange("availableSeats", n)}
                  className={`w-[38px] h-[38px] rounded-full font-bold text-[15px] cursor-pointer border-2 transition-colors
                    ${Number(data.availableSeats) === n
                      ? "border-[#00aff5] bg-[#00aff5] text-white"
                      : "border-[#d1dde0] bg-white text-[#054752]"
                    }`}
                >
                  {n}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <ContinueBtn
            label="Publish a Ride"
            onClick={onNext}
            disabled={!data.startLocation || !data.endLocation || !data.availableSeats}
          />
        </div>
      </motion.div>
    </div>
  );
}

// ─── STEP 2 — Stopovers ───────────────────────────────────────────────────────
function Step2({ data, onChange, onNext, onBack }) {
  const [stopovers, setStopovers] = useState(data.stopovers || []);
  const [input, setInput] = useState("");

  const addCity = () => {
    if (!input.trim()) return;
    const next = [...stopovers, input.trim()];
    setStopovers(next);
    onChange("stopovers", next);
    setInput("");
  };

  const removeCity = (i) => {
    const next = stopovers.filter((_, idx) => idx !== i);
    setStopovers(next);
    onChange("stopovers", next);
  };

  return (
    <div className="max-w-[500px] w-full mx-auto">
      <h2 className="text-[#054752] font-black text-[26px] text-center mb-2">
        Add stopovers to get more passengers
      </h2>
      <p className="text-[#8aacb1] text-center text-[15px] mb-7">
        Pick up passengers along the way and earn more.
      </p>

      {/* Route preview */}
      <div className="bg-[#e8f8fe] rounded-[1.5rem] px-6 py-3.5 mb-5 flex items-center gap-2">
        <span className="font-bold text-[#054752]">{data.startLocation}</span>
        <span className="text-[#00aff5] flex-1 text-center">→</span>
        <span className="font-bold text-[#054752]">{data.endLocation}</span>
      </div>

      <AnimatePresence>
        {stopovers.map((city, i) => (
          <motion.div
            key={city + i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center justify-between bg-white rounded-[1rem] px-5 py-3.5 mb-2.5 shadow-[0_2px_12px_rgba(5,71,82,0.07)]"
          >
            <span className="font-semibold text-[#054752] flex items-center gap-2">
              <FiMapPin className="text-[#00aff5]" /> {city}
            </span>
            <button
              onClick={() => removeCity(i)}
              className="bg-[#fee8e8] border-none rounded-full p-1.5 cursor-pointer text-[#e05252]"
            >
              <FiX size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex gap-2.5 mb-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCity()}
          placeholder="Enter a city..."
          className="flex-1 border-2 border-[#e8f0f2] rounded-full px-5 py-3 text-base text-[#054752] outline-none font-semibold focus:border-[#00aff5] transition-colors"
        />
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={addCity}
          className="bg-[#00aff5] border-none rounded-full px-5 py-3 text-white font-bold text-[15px] cursor-pointer flex items-center gap-1.5"
        >
          <FiPlus /> Add city
        </motion.button>
      </div>

      <div className="flex justify-between items-center">
        <BackBtn onClick={onBack} />
        <ContinueBtn onClick={onNext} />
      </div>
    </div>
  );
}

// ─── STEP 3 — Date ────────────────────────────────────────────────────────────
function Step3({ data, onChange, onNext, onBack }) {
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthName   = new Date(viewYear, viewMonth).toLocaleString("en-US", { month: "long" });
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const selectDate = (day) => {
    const d   = new Date(viewYear, viewMonth, day);
    const iso = d.toISOString().split("T")[0];
    const timePart = data.departureTime?.split("T")[1] || "11:00";
    onChange("departureTime", `${iso}T${timePart}`);
  };

  const isPast     = (day) => new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isToday    = (day) => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
  const isSelected = (day) => data.departureTime?.startsWith(new Date(viewYear, viewMonth, day).toISOString().split("T")[0]);

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  return (
    <div className="max-w-[460px] w-full mx-auto">
      <h2 className="text-[#054752] font-black text-[28px] text-center mb-8">
        When are you going?
      </h2>

      <div className="bg-white rounded-[2rem] p-7 shadow-[0_8px_40px_rgba(5,71,82,0.08)]">
        <div className="flex items-center justify-between mb-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
            className="bg-[#e8f0f2] border-none rounded-full w-9 h-9 cursor-pointer flex items-center justify-center text-[#054752]"
          >
            <FiChevronLeft />
          </motion.button>
          <span className="font-extrabold text-[18px] text-[#054752]">{monthName} {viewYear}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            className="bg-[#e8f0f2] border-none rounded-full w-9 h-9 cursor-pointer flex items-center justify-center text-[#054752]"
          >
            <FiChevronRight />
          </motion.button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
            <div key={d} className="text-center text-xs font-bold text-[#8aacb1] py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day  = i + 1;
            const past = isPast(day);
            const sel  = isSelected(day);
            const tod  = isToday(day);
            return (
              <motion.button
                key={day}
                whileHover={!past ? { scale: 1.12 } : {}}
                whileTap={!past ? { scale: 0.95 } : {}}
                onClick={() => !past && selectDate(day)}
                className={`rounded-full py-2 text-sm text-center border-2 transition-colors
                  ${sel ? "bg-[#00aff5] text-white border-transparent font-extrabold"
                    : tod ? "border-[#00aff5] bg-transparent text-[#054752] font-medium"
                    : past ? "border-transparent text-[#c5d8dc] cursor-default font-medium"
                    : "border-transparent text-[#054752] font-medium cursor-pointer"}`}
              >
                {day}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center mt-7">
        <BackBtn onClick={onBack} />
        <ContinueBtn onClick={onNext} disabled={!data.departureTime} />
      </div>
    </div>
  );
}

// ─── STEP 4 — Time ────────────────────────────────────────────────────────────
function Step4({ data, onChange, onNext, onBack }) {
  const existingTime = data.departureTime?.split("T")[1] || "11:00";
  const [hours,   setHours]   = useState(parseInt(existingTime.split(":")[0]));
  const [minutes, setMinutes] = useState(parseInt(existingTime.split(":")[1]));

  const updateTime = (h, m) => {
    const datePart = data.departureTime?.split("T")[0] || new Date().toISOString().split("T")[0];
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    onChange("departureTime", `${datePart}T${hh}:${mm}`);
  };

  const changeHours   = (d) => { const h = (hours + d + 24) % 24; setHours(h); updateTime(h, minutes); };
  const changeMinutes = (d) => { const m = (minutes + d + 60) % 60; setMinutes(m); updateTime(hours, m); };
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="max-w-[440px] w-full mx-auto text-center">
      <h2 className="text-[#054752] font-black text-[26px] mb-2">
        At what time will you pick passengers up?
      </h2>
      <p className="text-[#8aacb1] text-[15px] mb-10">
        Departure from <strong className="text-[#054752]">{data.startLocation}</strong>
      </p>

      <div className="bg-white rounded-[2rem] px-12 py-9 shadow-[0_8px_40px_rgba(5,71,82,0.08)] inline-block mb-10">
        <div className="flex items-center gap-4">
          {/* Hours column */}
          <div className="flex flex-col items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => changeHours(1)}
              className="bg-[#e8f8fe] border-none rounded-full w-10 h-10 cursor-pointer text-[#00aff5] text-lg flex items-center justify-center"
            >▲</motion.button>
            <div className="text-[60px] font-black text-[#054752] min-w-[88px] text-center leading-none">
              {pad(hours)}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => changeHours(-1)}
              className="bg-[#e8f8fe] border-none rounded-full w-10 h-10 cursor-pointer text-[#00aff5] text-lg flex items-center justify-center"
            >▼</motion.button>
          </div>

          <div className="text-[56px] font-black text-[#c5d8dc]">:</div>

          {/* Minutes column */}
          <div className="flex flex-col items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => changeMinutes(15)}
              className="bg-[#e8f8fe] border-none rounded-full w-10 h-10 cursor-pointer text-[#00aff5] text-lg flex items-center justify-center"
            >▲</motion.button>
            <div className="text-[60px] font-black text-[#054752] min-w-[88px] text-center leading-none">
              {pad(minutes)}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => changeMinutes(-15)}
              className="bg-[#e8f8fe] border-none rounded-full w-10 h-10 cursor-pointer text-[#00aff5] text-lg flex items-center justify-center"
            >▼</motion.button>
          </div>
        </div>
        <div className="mt-3.5 text-[13px] text-[#8aacb1] font-semibold">
          Tap ▲▼ to set time · Minutes snap to 15-min steps
        </div>
      </div>

      <div className="flex justify-between items-center">
        <BackBtn onClick={onBack} />
        <ContinueBtn onClick={onNext} />
      </div>
    </div>
  );
}

// ─── STEP 5 — Price ───────────────────────────────────────────────────────────
function Step5({ data, onChange, onNext, onBack }) {
  const [price, setPrice] = useState(Number(data.pricePerSeat) || 10);
  const MIN = 5, MAX = 5000, REC_MIN = 10, REC_MAX = 20;
  const inRange = price >= REC_MIN && price <= REC_MAX;

  const adjust = (delta) => {
    const step = price < 100 ? 5 : 50;
    const next = Math.min(MAX, Math.max(MIN, price + delta * step));
    setPrice(next);
    onChange("pricePerSeat", next);
  };

  return (
    <div className="max-w-[460px] w-full mx-auto text-center">
      <h2 className="text-[#054752] font-black text-[28px] mb-2">
        Set your price per seat
      </h2>
      <p className="text-[#8aacb1] text-[15px] mb-9">
        {data.startLocation} → {data.endLocation}
      </p>

      <div className="bg-white rounded-[2rem] px-8 pt-10 pb-8 shadow-[0_8px_40px_rgba(5,71,82,0.08)] mb-9">
        <div className="flex items-center justify-center gap-6 mb-6">
          <motion.button
            whileHover={{ scale: price <= MIN ? 1 : 1.1 }}
            whileTap={{ scale: price <= MIN ? 1 : 0.9 }}
            onClick={() => adjust(-1)}
            disabled={price <= MIN}
            className={`w-14 h-14 rounded-full border-[2.5px] bg-white flex items-center justify-center transition-colors
              ${price <= MIN ? "border-[#d1dde0] text-[#d1dde0] cursor-not-allowed" : "border-[#054752] text-[#054752] cursor-pointer"}`}
          >
            <FiMinus size={22} />
          </motion.button>

          <motion.div
            key={price}
            initial={{ scale: 0.85, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="min-w-[160px]"
          >
            <span className={`text-[72px] font-black ${inRange ? "text-[#1a8c4e]" : "text-[#054752]"}`}>
              ₹{price}
            </span>
          </motion.div>

          <motion.button
            whileHover={{ scale: price >= MAX ? 1 : 1.1 }}
            whileTap={{ scale: price >= MAX ? 1 : 0.9 }}
            onClick={() => adjust(1)}
            disabled={price >= MAX}
            className={`w-14 h-14 rounded-full border-[2.5px] border-[#00aff5] bg-white text-[#00aff5] flex items-center justify-center transition-colors
              ${price >= MAX ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <FiPlus size={22} />
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {inRange ? (
            <motion.div
              key="good"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#e6f7ef] rounded-full inline-flex items-center gap-2 px-5 py-2"
            >
              <span className="bg-[#1a8c4e] rounded-full w-[18px] h-[18px] flex items-center justify-center">
                <FiCheck size={11} color="#fff" />
              </span>
              <span className="font-bold text-[14px] text-[#1a8c4e]">
                Recommended price: ₹{REC_MIN}–₹{REC_MAX}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#fff8e6] rounded-full inline-flex items-center gap-2 px-5 py-2"
            >
              <span className="font-bold text-[14px] text-[#b07a00]">
                💡 Recommended: ₹{REC_MIN}–₹{REC_MAX}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {inRange && (
          <p className="text-[#8aacb1] mt-2.5 text-sm">
            Perfect price! You'll get passengers in no time.
          </p>
        )}

        <div className="mt-6">
          <input
            type="range"
            min={MIN}
            max={MAX}
            value={price}
            onChange={(e) => { const v = parseInt(e.target.value); setPrice(v); onChange("pricePerSeat", v); }}
            className="w-full cursor-pointer accent-[#00aff5]"
          />
          <div className="flex justify-between text-xs text-[#8aacb1] font-semibold mt-1">
            <span>₹{MIN}</span><span>₹{MAX}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <BackBtn onClick={onBack} />
        <ContinueBtn onClick={onNext} />
      </div>
    </div>
  );
}

// ─── STEP 6 — Comment + Publish ───────────────────────────────────────────────
function Step6({ data, onChange, onPublish, onBack, loading, published }) {
  if (published) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-[420px] mx-auto"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-[72px] mb-5"
        >
          🎉
        </motion.div>
        <h2 className="text-[#054752] font-black text-[30px] mb-3">Ride Published!</h2>
        <p className="text-[#5a8690] text-base mb-6">
          Your ride from <strong>{data.startLocation}</strong> to <strong>{data.endLocation}</strong> is now live.
          Passengers will start booking soon!
        </p>
        <div className="bg-[#e6f7ef] rounded-[1.5rem] px-6 py-4 inline-block font-bold text-[#1a8c4e] text-[18px]">
          ₹{data.pricePerSeat} / seat
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-[520px] w-full mx-auto">
      <h2 className="text-[#054752] font-black text-[28px] text-center mb-2">
        Ready to publish your ride?
      </h2>
      <p className="text-[#8aacb1] text-center mb-7 text-[15px]">
        Add a note to help passengers know what to expect.
      </p>

      {/* Summary card */}
      <div className="bg-[#e8f8fe] rounded-[1.5rem] px-6 py-5 mb-6 grid grid-cols-2 gap-4">
        {[
          { label: "From → To", value: `${data.startLocation} → ${data.endLocation}` },
          { label: "Departure", value: data.departureTime?.replace("T", " ") },
          { label: "Seats", value: data.availableSeats },
          { label: "Price / Seat", value: `₹${data.pricePerSeat}` },
        ].map(({ label, value }) => (
          <div key={label}>
            <div className="text-[11px] font-bold text-[#8aacb1] uppercase tracking-widest mb-1">{label}</div>
            <div className="font-bold text-[#054752] text-[15px]">{value}</div>
          </div>
        ))}
      </div>

      {/* Comment */}
      <div className="mb-8">
        <label className="text-[15px] font-bold text-[#054752] block mb-2.5">
          <FiMessageSquare className="inline align-middle mr-1.5 text-[#00aff5]" />
          Message for passengers (optional)
        </label>
        <textarea
          value={data.comment || ""}
          onChange={(e) => onChange("comment", e.target.value)}
          placeholder="Flexible about where and when to meet? Not taking the motorway? Got limited space in your boot? Keep passengers in the loop."
          rows={5}
          className="w-full border-2 border-[#e8f0f2] rounded-[1.25rem] px-5 py-4 text-[15px] text-[#054752] outline-none resize-y leading-relaxed box-border font-[inherit] focus:border-[#00aff5] transition-colors"
        />
      </div>

      <div className="flex justify-between items-center">
        <BackBtn onClick={onBack} />
        <ContinueBtn label="Publish Ride 🚀" onClick={onPublish} loading={loading} />
      </div>
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function CreateTrip() {
  const navigate = useNavigate();

  const [step,      setStep]      = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading,   setLoading]   = useState(false);
  const [published, setPublished] = useState(false);

  const [form, setForm] = useState({
    startLocation:  "",
    endLocation:    "",
    departureTime:  "",
    availableSeats: "",
    pricePerSeat:   "",
    stopovers: [],
    comment:   "",
  });

  const onChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const goNext = () => { setDirection(1);  setStep((s) => Math.min(s + 1, TOTAL_STEPS)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const payload = {
        startLocation:  form.startLocation,
        endLocation:    form.endLocation,
        departureTime:  form.departureTime,
        pricePerSeat:   form.pricePerSeat,
        availableSeats: form.availableSeats,
        stopovers:      form.stopovers,
        comment:        form.comment,
      };
      await api.post("/api/trip", payload);
      setPublished(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  const steps = {
    1: <Step1 data={form} onChange={onChange} onNext={goNext} />,
    2: <Step2 data={form} onChange={onChange} onNext={goNext} onBack={goBack} />,
    3: <Step3 data={form} onChange={onChange} onNext={goNext} onBack={goBack} />,
    4: <Step4 data={form} onChange={onChange} onNext={goNext} onBack={goBack} />,
    5: <Step5 data={form} onChange={onChange} onNext={goNext} onBack={goBack} />,
    6: <Step6 data={form} onChange={onChange} onPublish={handlePublish} onBack={goBack} loading={loading} published={published} />,
  };

  return (
    <div className="min-h-screen bg-[#f1f4f5] font-[Nunito,_'Segoe_UI',_sans-serif]">
      {/* Sticky header + progress bar wrapped together */}
      <div>
        <div className="bg-white px-6 py-4 flex items-center justify-between shadow-[0_2px_12px_rgba(5,71,82,0.07)]">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">🚙</span>
            <span className="font-black text-[18px] text-[#054752]">BlaBlaCar</span>
          </div>
          {!published && (
            <span className="text-[13px] text-[#8aacb1] font-semibold">
              Step {step} of {TOTAL_STEPS}
            </span>
          )}
        </div>

        {/* Progress bar sits flush below navbar, inside the same sticky wrapper */}
        {!published && (
          <div className="h-1 bg-[#e8f0f2]">
            <motion.div
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              className="h-full bg-[#00aff5] rounded-full"
              transition={{ duration: 0.4 }}
            />
          </div>
        )}
      </div>

      {/* Page body */}
      <div className="px-6 pt-10 pb-20 max-w-[700px] mx-auto">
        {!published && <StepDots step={step} />}

        <div className="overflow-hidden relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={SLIDE}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={SLIDE.transition}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
