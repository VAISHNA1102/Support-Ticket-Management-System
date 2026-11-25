const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const {
  getTicketActivity
} = require("../controllers/activity.controller");

router.get("/:ticketId", protect, getTicketActivity);

module.exports = router;