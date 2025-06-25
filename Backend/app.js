// app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ─── Routes ──────────────────────────────────────────
app.use("/api/auth", authRoutes);

// Health-check
app.get("/", (_, res) =>
  res.send("<h1>Welcome to TuneSync App </h1> <h2>API running 👍</h2>")
);

export default app;
