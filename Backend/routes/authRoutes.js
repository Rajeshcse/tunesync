// routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  userProfile,
  dashboard,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
} from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/validators.js";
import { authorizedUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

router.post("/refresh-token", refreshAccessToken);
router.get("/dashboard", authorizedUser, dashboard);
router.get("/profile", authorizedUser, userProfile);

// routes/authRoutes.js
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
