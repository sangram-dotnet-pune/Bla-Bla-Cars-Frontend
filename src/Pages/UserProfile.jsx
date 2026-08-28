import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/apiClient";
import { useAuth } from "../Context/AuthContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiCheck,
  FiX,
  FiKey,
  FiInfo,
  FiMessageSquare,
} from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";

const inputClass =
  "w-full px-4 py-2.5 text-[15px] text-[#054752] bg-white border border-[#c9dde3] rounded-xl placeholder:text-[#9db7bd] focus:outline-none focus:border-[#00AFF5] focus:ring-2 focus:ring-[#00AFF5]/20 transition-all";

const labelClass =
  "block text-[13px] font-semibold text-[#054752] mb-1.5";

const sectionCardClass =
  "bg-white rounded-3xl bb-elevation-soft border border-[#e4eef1] overflow-hidden";

const sectionHeaderClass =
  "px-6 py-4 border-b border-[#e4eef1] flex items-center justify-between gap-3";

const saveButtonClass =
  "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-[#00AFF5] hover:bg-[#009ad9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const userId = user?.userId || user?.guid;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Personal details
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [personalMsg, setPersonalMsg] = useState(null);

  // About you
  const [miniBio, setMiniBio] = useState("");
  const [travelPreferences, setTravelPreferences] = useState("");
  const [savingAbout, setSavingAbout] = useState(false);
  const [aboutMsg, setAboutMsg] = useState(null);

  // Vehicle
  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
  });
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [vehicleMsg, setVehicleMsg] = useState(null);

  // Editable state flags
  const [editing, setEditing] = useState({
    personal: false,
    about: false,
    vehicle: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`/auth/me/${userId}`);
        const data = res.data?.user || res.data || {};

        setFullName(data.fullName ?? fullName);
        setEmail(data.email ?? email);
        setPhoneNumber(data.phoneNumber ?? phoneNumber);
        setMiniBio(data.miniBio ?? "");
        setTravelPreferences(data.travelPreferences ?? "");
        setVehicle({
          make: data.vehicle?.make ?? data.make ?? "",
          model: data.vehicle?.model ?? data.model ?? "",
          year: data.vehicle?.year ?? data.year ?? "",
          color: data.vehicle?.color ?? data.color ?? "",
          licensePlate: data.vehicle?.licensePlate ?? data.licensePlate ?? "",
        });
      } catch (err) {
        setLoadError(
          err.response?.status === 401
            ? "Please log in to view your profile."
            : "Failed to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const toast = (setter, message) => {
    setter({ type: message.type, text: message.text });
    setTimeout(() => setter(null), 3000);
  };

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setSavingPersonal(true);
    setPersonalMsg(null);
    try {
      await updateProfile(fullName, phoneNumber, email);
      setEditing((s) => ({ ...s, personal: false }));
      toast(setPersonalMsg, { type: "success", text: "Personal details updated." });
    } catch {
      toast(setPersonalMsg, { type: "error", text: "Failed to update personal details." });
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setSavingAbout(true);
    setAboutMsg(null);
    try {
      await api.put("/auth/profile/about", {
        miniBio,
        travelPreferences,
      });
      setEditing((s) => ({ ...s, about: false }));
      toast(setAboutMsg, { type: "success", text: "About section updated." });
    } catch {
      toast(setAboutMsg, { type: "error", text: "Failed to update about section." });
    } finally {
      setSavingAbout(false);
    }
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    setSavingVehicle(true);
    setVehicleMsg(null);
    const payload = {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year ? Number(vehicle.year) : undefined,
      color: vehicle.color,
      licensePlate: vehicle.licensePlate,
    };
    try {
      await api.put("/auth/profile/vehicle", payload);
      setEditing((s) => ({ ...s, vehicle: false }));
      toast(setVehicleMsg, { type: "success", text: "Vehicle updated." });
    } catch {
      toast(setVehicleMsg, { type: "error", text: "Failed to update vehicle." });
    } finally {
      setSavingVehicle(false);
    }
  };

  if (!userId || (!loading && loadError && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 text-center px-4">
        <div>
          <p className="text-5xl mb-4">👤</p>
          <p className="text-gray-600 font-medium">
            {loadError || "User not logged in"}
          </p>
          <Link
            to="/login"
            className="mt-4 inline-block bb-pill-button bb-button-primary px-6 py-2.5 text-white font-semibold"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const toggleEdit = (key) =>
    setEditing((s) => ({ ...s, [key]: !s[key] }));

  const renderMsg = (msg) =>
    msg && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-[13px] font-semibold ${
          msg.type === "success" ? "text-green-600" : "text-red-600"
        }`}
      >
        {msg.text}
      </motion.p>
    );

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#eef9fe] via-white to-[#eef9fe]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#00AFF5] text-white text-4xl font-bold mb-4 shadow-lg">
            {(fullName || user?.fullName || "U").charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-extrabold text-[#054752]">
            {fullName || user?.fullName || "Your Profile"}
          </h1>
          <p className="text-[#5c828a] mt-1">Manage your personal details, about, and vehicle</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading profile...</div>
        ) : (
          <div className="space-y-6">
            {/* ============ PERSONAL DETAILS ============ */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={sectionCardClass}
            >
              <div className={sectionHeaderClass}>
                <h2 className="text-lg font-bold text-[#054752] flex items-center gap-2">
                  <FiUser className="text-[#00AFF5]" /> Personal Details
                </h2>
                {!editing.personal && (
                  <button
                    onClick={() => toggleEdit("personal")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-[#054752] bg-[#eef9fe] hover:bg-[#d9f2fd] transition-colors"
                  >
                    <FiEdit2 /> Edit
                  </button>
                )}
              </div>

              <div className="p-6">
                {editing.personal ? (
                  <form onSubmit={handleSavePersonal} className="space-y-4">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-3.5 top-3.5 text-[#9db7bd] pointer-events-none" />
                        <input
                          className={`${inputClass} pl-10`}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <div className="relative">
                        <FiMail className="absolute left-3.5 top-3.5 text-[#9db7bd] pointer-events-none" />
                        <input
                          type="email"
                          className={`${inputClass} pl-10`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3.5 top-3.5 text-[#9db7bd] pointer-events-none" />
                        <input
                          className={`${inputClass} pl-10`}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                    </div>

                    {renderMsg(personalMsg)}

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={savingPersonal}
                        className={saveButtonClass}
                      >
                        {savingPersonal ? "Saving..." : <><FiCheck /> Save</>}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleEdit("personal")}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-[#054752] border border-[#c9dde3] hover:bg-[#eef9fe] transition-colors"
                      >
                        <FiX /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <InfoRow icon={<FiUser />} label="Full Name" value={fullName || user?.fullName} />
                    <InfoRow icon={<FiMail />} label="Email" value={email || user?.email} />
                    <InfoRow icon={<FiPhone />} label="Phone" value={phoneNumber || user?.phoneNumber || "—"} />
                  </div>
                )}
              </div>
            </motion.section>

            {/* ============ ABOUT YOU ============ */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className={sectionCardClass}
            >
              <div className={sectionHeaderClass}>
                <h2 className="text-lg font-bold text-[#054752] flex items-center gap-2">
                  <FiInfo className="text-[#00AFF5]" /> About You
                </h2>
                {!editing.about && (
                  <button
                    onClick={() => toggleEdit("about")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-[#054752] bg-[#eef9fe] hover:bg-[#d9f2fd] transition-colors"
                  >
                    <FiEdit2 /> Edit
                  </button>
                )}
              </div>

              <div className="p-6">
                {editing.about ? (
                  <form onSubmit={handleSaveAbout} className="space-y-4">
                    <div>
                      <label className={labelClass}>Mini Bio</label>
                      <textarea
                        rows={3}
                        className={inputClass}
                        placeholder="Tell people a little about yourself, e.g. I enjoy road trips."
                        value={miniBio}
                        onChange={(e) => setMiniBio(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Travel Preferences</label>
                      <input
                        className={inputClass}
                        placeholder="e.g. Non-smoking, music lover, quiet"
                        value={travelPreferences}
                        onChange={(e) => setTravelPreferences(e.target.value)}
                      />
                    </div>

                    {renderMsg(aboutMsg)}

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={savingAbout}
                        className={saveButtonClass}
                      >
                        {savingAbout ? "Saving..." : <><FiCheck /> Save</>}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleEdit("about")}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-[#054752] border border-[#c9dde3] hover:bg-[#eef9fe] transition-colors"
                      >
                        <FiX /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-[#f7fbfd] rounded-2xl p-4">
                      <p className="text-[12px] font-semibold text-[#5c828a] uppercase tracking-wide mb-1">
                        Mini Bio
                      </p>
                      <p className="text-[15px] text-[#054752]">
                        {miniBio || "No bio added yet."}
                      </p>
                    </div>
                    <div className="bg-[#f7fbfd] rounded-2xl p-4">
                      <p className="text-[12px] font-semibold text-[#5c828a] uppercase tracking-wide mb-1">
                        Travel Preferences
                      </p>
                      <p className="text-[15px] text-[#054752]">
                        {travelPreferences || "No preferences set."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>

            {/* ============ VEHICLE ============ */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={sectionCardClass}
            >
              <div className={sectionHeaderClass}>
                <h2 className="text-lg font-bold text-[#054752] flex items-center gap-2">
                  <MdDirectionsCar className="text-[#00AFF5]" /> Vehicle
                </h2>
                {!editing.vehicle && (
                  <button
                    onClick={() => toggleEdit("vehicle")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-[#054752] bg-[#eef9fe] hover:bg-[#d9f2fd] transition-colors"
                  >
                    <FiEdit2 /> Edit
                  </button>
                )}
              </div>

              <div className="p-6">
                {editing.vehicle ? (
                  <form onSubmit={handleSaveVehicle} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Make</label>
                        <input
                          className={inputClass}
                          placeholder="e.g. Maruti"
                          value={vehicle.make}
                          onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Model</label>
                        <input
                          className={inputClass}
                          placeholder="e.g. Swift"
                          value={vehicle.model}
                          onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Year</label>
                        <input
                          type="number"
                          className={inputClass}
                          placeholder="e.g. 2022"
                          value={vehicle.year}
                          onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Color</label>
                        <input
                          className={inputClass}
                          placeholder="e.g. White"
                          value={vehicle.color}
                          onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>License Plate</label>
                      <input
                        className={inputClass}
                        placeholder="e.g. MH12AB1234"
                        value={vehicle.licensePlate}
                        onChange={(e) => setVehicle({ ...vehicle, licensePlate: e.target.value })}
                      />
                    </div>

                    {renderMsg(vehicleMsg)}

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={savingVehicle}
                        className={saveButtonClass}
                      >
                        {savingVehicle ? "Saving..." : <><FiCheck /> Save</>}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleEdit("vehicle")}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-[#054752] border border-[#c9dde3] hover:bg-[#eef9fe] transition-colors"
                      >
                        <FiX /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <VehicleInfo label="Make" value={vehicle.make} />
                    <VehicleInfo label="Model" value={vehicle.model} />
                    <VehicleInfo label="Year" value={vehicle.year} />
                    <VehicleInfo label="Color" value={vehicle.color} />
                    <div className="col-span-2 sm:col-span-3">
                      <div className="bg-[#f7fbfd] rounded-2xl p-4">
                        <p className="text-[12px] font-semibold text-[#5c828a] uppercase tracking-wide mb-1">
                          License Plate
                        </p>
                        <p className="text-[15px] text-[#054752]">
                          {vehicle.licensePlate || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Account actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <Link
                to="/change-password"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[15px] font-semibold text-[#054752] bg-white border border-[#c9dde3] hover:bg-[#eef9fe] transition-colors"
              >
                <FiKey /> Change Password
              </Link>
              <Link
                to="/chats"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[15px] font-semibold text-white bg-[#00AFF5] hover:bg-[#009ad9] transition-colors"
              >
                <FiMessageSquare /> My Chats
              </Link>
            </motion.div>
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
