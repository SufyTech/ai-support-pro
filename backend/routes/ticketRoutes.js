// routes/ticketRoutes.js
const express = require("express");
const {
  createTicketHandler,
  getTicketsHandler,
  getTicketStatsHandler,
  updateTicketStatusHandler,
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/tickets", createTicketHandler);
router.get("/tickets", getTicketsHandler);
router.get("/tickets/stats", getTicketStatsHandler);

// status update route
router.patch("/tickets/:id/status", updateTicketStatusHandler);

module.exports = router;
