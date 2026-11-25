const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const {
  createTicket,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket
} = require("../controllers/ticket.controller");

router.use(protect);

router.post("/", createTicket);
router.get("/my-tickets", getMyTickets);
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

module.exports = router;