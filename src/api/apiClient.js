import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY || "http://localhost:5003",
  headers: {
    "Content-Type": "application/json",
  },
  // You can add interceptors here for auth tokens later
});

export default api;
