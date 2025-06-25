import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "./ResetPassword.scss";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, {
        password,
      });
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
