const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  getAllTickets,
  updateTicketManagement,
  getDashboardStats
} = require("../controllers/admin.controller");

router.use(protect);
router.use(authorizeRoles("ADMIN"));

router.get("/tickets", getAllTickets);
router.patch("/tickets/:id", updateTicketManagement);
router.get("/dashboard", getDashboardStats);

module.exports = router;