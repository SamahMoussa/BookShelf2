import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Signup.css";

const Signup = () => {
  const { user, signup } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return alert("Fill all fields");

    setLoading(true);
    const result = await signup(username, email, password);
    setLoading(false);

    if (result.success) {
      alert(`Signup successful! Welcome, ${result.user.username}`);
    } else {
      alert(result.message);
    }
  };

  if (user) {
    return (
      <div className="auth-box">
        <h2>Welcome, {user.username}!</h2>
        <p>You are already signed up and logged in.</p>
      </div>
    );
  }

  return (
    <div className="auth-box">
      <h2>Sign Up</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
