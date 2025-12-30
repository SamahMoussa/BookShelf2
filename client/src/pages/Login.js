import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const { user, login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    // ✅ Required fields check
    if (!username.trim() || !password.trim()) {
      alert("Username and password are required");
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      alert(`Welcome back, ${result.user.username}!`);
    } else {
      alert(result.message || "Invalid username or password");
    }
  };

  // ✅ Already logged in
  if (user) {
    return (
      <div className="auth-box">
        <h2>Welcome, {user.username}!</h2>
        <p>You are already logged in.</p>
      </div>
    );
  }

  return (
    <div className="auth-box">
      <h2>Login</h2>

      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
