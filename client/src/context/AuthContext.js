import React, { createContext, useEffect, useState } from "react";
import { getUserProfile } from "../utils/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Fetch user profile if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      getUserProfile().then(data => {
        if (data && data.name) setUser(data);
      });
    }
  }, []);

  function loginUser(userObj, token) {
    localStorage.setItem("token", token);
    setUser(userObj);
  }

  function logoutUser() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
