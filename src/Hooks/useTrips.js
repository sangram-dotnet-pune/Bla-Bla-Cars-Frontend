import { useEffect, useState } from "react";
import api from "../api/apiClient";

export default function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/trip");
      setTrips(res.data || []);
    } catch (err) {
      console.error("Failed to fetch trips", err);
      // Extract error message safely
      if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else if (err.response?.status === 404) {
        setError("API endpoint not found. Please check backend configuration.");
      } else if (err.code === "ERR_NETWORK" || err.message?.includes("Failed to fetch")) {
        setError("Backend services are not running. Please start the backend server.");
      } else {
        setError(err.response?.data?.message || "Failed to load trips. Please try again.");
      }
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return { trips, loading, error, refresh: fetchTrips };
}
