import React, { useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import "../styles/Signup.css";

const Signup = () => {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!username || !email) return alert('Fill both fields');
    // In-memory "sign up" just logs in the user
    login(username, email);
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
      <h2>SignUp</h2>
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
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
