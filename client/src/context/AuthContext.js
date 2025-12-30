import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ FIX: define user + setUser
  const [user, setUser] = useState(null);

  // ✅ LOGIN FUNCTION
  const login = async (username, password) => {
    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message };
      }

      // ✅ save user
      setUser(data);

      return { success: true, user: data };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Server error" };
    }
  };

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
