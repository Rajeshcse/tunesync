// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import "./Dashboard.scss";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/auth/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">User Dashboard</h2>
      <div className="user-grid">
        {users.length > 0 ? (
          users.map((user) => (
            <div className="user-card" key={user._id}>
              <p>
                <strong>👤 Username:</strong> {user.username}
              </p>
              <p>
                <strong>📧 Email:</strong> {user.email}
              </p>
            </div>
          ))
        ) : (
          <p className="no-users">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
