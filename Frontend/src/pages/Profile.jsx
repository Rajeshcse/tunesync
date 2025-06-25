import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./Profile.scss";

const Profile = () => {
  const { auth, logout } = useAuth(); // ✅ moved inside component

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.currentUserDetail);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>My Profile</h2>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <button onClick={logoutHandler}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
