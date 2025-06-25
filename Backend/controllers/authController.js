// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return true;
  }
  return false;
};

// Register a new user
export const registerUser = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: savedUser.username,
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed. Please try again later.",
      error: error.message,
    });
  }
};

//   Login user and return JWT token

export const loginUser = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Get current user's profile
export const userProfile = async (req, res) => {
  try {
    const currentUserDetail = await User.findById(req.user.user_id).select(
      "-password -__v"
    );
    if (!currentUserDetail) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User profile fetched", currentUserDetail });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};

// Get all users for dashboard
export const dashboard = async (req, res) => {
  try {
    const users = await User.find({}, "-password -__v"); // exclude password and __v fields
    if (users.length === 0) {
      return res.status(404).json({ message: "No Users available" });
    }
    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found with this email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Use your email service like Gmail, Mailtrap, etc.
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password. Link valid for 15 mins.</p>`,
    });

    res.status(200).json({ message: "Reset email sent!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending reset link", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const hash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token is invalid or expired" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not reset password", error: error.message });
  }
};
