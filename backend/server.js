// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "ai-support-backend" });
});

// Ticket routes
app.use("/api", ticketRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
