import React, { useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // Submit handler
  const submit = (e) => {
    e.preventDefault();
    if (!username || !email) return alert('Fill both fields');
    login(username, email);
  };

  // If already logged in, show a message instead of form
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
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
        />
        <input 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
