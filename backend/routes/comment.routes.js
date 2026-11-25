const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const {
  addComment,
  getComments
} = require("../controllers/comment.controller");

router.use(protect);

router.post("/:ticketId", addComment);
router.get("/:ticketId", getComments);

module.exports = router;