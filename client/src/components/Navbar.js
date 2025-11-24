import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";
import { AuthContext } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { searchText, setSearchText } = useContext(SearchContext);
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>

      <input
        type="text"
        className="search-bar"
        placeholder="Search books..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <nav className={`nav-links ${open ? "open" : ""}`}>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        <NavLink to="/books" className={({ isActive }) => (isActive ? "active" : "")}>
          Books
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
          Profile
        </NavLink>

        {!user && <NavLink to="/login">Login</NavLink>}
        {!user && <NavLink to="/signup">SignUp</NavLink>}

        {user && (
          <button className="link-button" onClick={logout}>
            Logout
          </button>
        )}
      </nav>

      <button
        className={`hamburger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>
    </header>
  );
};

export default Navbar;
