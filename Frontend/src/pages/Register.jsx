import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.scss";
import axios from "../utils/axiosInstance";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/register", formData);
      toast.success(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        errors.forEach((e) => toast.error(e.msg));
      } else {
        toast.error(err.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="Create New Username"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Enter Your Email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Create Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
