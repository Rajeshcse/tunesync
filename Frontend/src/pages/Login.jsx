import { useState } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./Login.scss";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", formData);
      toast.success(res.data.message);
      setAuth({
        user: res.data.user,
        token: res.data.token,
      });

      localStorage.setItem("token", res.data.token);
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <div className="login-footer-links">
          <span>
            Don't have an account? <a href="/register">Register here</a>
          </span>
          <span className="separator">|</span>
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
