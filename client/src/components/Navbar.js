import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn, onLoginClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
    toast.success("Logged out successfully!");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <h1>MyApp</h1>
        </div>
        
        {isLoggedIn ? (
          <button className="login-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;