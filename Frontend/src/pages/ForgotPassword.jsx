import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "./ForgotPassword.scss";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
