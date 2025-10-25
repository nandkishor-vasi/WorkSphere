import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";
import logo from "./logo.png"; 


const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const id = user?.id;
  const userRole = user?.role?.toLowerCase(); 

  const handleContactClick = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="logo-link">
            <img src={logo} alt="TaskFlow Logo" className="logo" />
            <span className="navbar-title">WorkSphere</span>
          </Link>
        </div>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <a href="#contact" onClick={handleContactClick} className="nav-link">Contact</a>

          {isLoggedIn && id && (
            <>

              {/* Dynamic Dashboard link based on user role */}
              <Link 
                to={userRole === "admin" ? `/adminDashboard/${id}` : `/memberDashboard/${id}`} 
                className="nav-link"
              >
                Dashboard
              </Link>

            </>
          )}

          {isLoggedIn ? (
            <button onClick={logout} className="auth-button">Logout</button>
          ) : (
            <Link to="/auth" className="auth-button">Login/Signup</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
