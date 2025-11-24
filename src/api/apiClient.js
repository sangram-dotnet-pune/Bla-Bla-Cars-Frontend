import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY || "http://localhost:5003",
  headers: {
    "Content-Type": "application/json",
  },
 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
