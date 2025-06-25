// src/utils/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // change to your backend port
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
