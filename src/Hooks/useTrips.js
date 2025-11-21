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
      setTrips(res.data);
    } catch (err) {
      console.error("Failed to fetch trips", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return { trips, loading, error, refresh: fetchTrips };
}
