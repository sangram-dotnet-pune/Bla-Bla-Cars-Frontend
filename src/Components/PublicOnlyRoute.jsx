import { Navigate } from "react-router-dom";

export default function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/" replace /> : children;
}
