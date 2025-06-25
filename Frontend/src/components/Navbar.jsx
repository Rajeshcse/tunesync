// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./Navbar.scss";

const Navbar = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth({ user: null, token: "" });
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">
        <Link to="/">TuneSync </Link>
      </h2>
      <div className="nav-links">
        {auth.token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
