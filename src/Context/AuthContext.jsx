import { createContext, useContext, useState } from "react";
import api from "../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // ---------------- LOGIN ----------------  
  const loginUser = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const authUser = {
      userId: res.data.userId,
      fullName: res.data.fullName,
      email: res.data.email,       // better to use response email
      phoneNumber: res.data.phoneNumber || "",
    };

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(authUser));

    setUser(authUser);
    setToken(res.data.token);

    return authUser;
  };

  // ---------------- REGISTER ----------------  
  const registerUser = async (fullName, phoneNumber, email, password) => {
    return await api.post("/auth/register", {
      fullName,
      phoneNumber,
      email,
      password,
    });
  };

  // ---------------- UPDATE PROFILE ----------------  
const updateProfile = async (fullName, phoneNumber, email) => {
  const userId = user.userId;

  await api.put("/auth/update-profile", {
    userId,
    fullName,
    phoneNumber,
    email,
  });

  // FIX: Email was missing before
  const updatedUser = {
    ...user,
    fullName,
    phoneNumber,
    email,   // ✅ ADD THIS
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));
  setUser(updatedUser);

  return updatedUser;
};


  // ---------------- CHANGE PASSWORD ----------------  
  const changePassword = async (oldPassword, newPassword) => {
    const userId = user.userId;   // FIXED

    return await api.put("/auth/change-password", {
      userId,
      oldPassword,
      newPassword,
    });
  };

  // ---------------- LOGOUT ----------------  
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginUser,
        registerUser,
        logoutUser,
        updateProfile,
        changePassword,   // FIXED
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
