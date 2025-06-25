// middleware/validators.js
import { check } from "express-validator";

export const validateRegister = [
  check("username").notEmpty().withMessage("Username is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const validateLogin = [
  check("email").isEmail().withMessage("Valid Email is required!"),
  check("password").notEmpty().withMessage("Password is required"),
];
