const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");
const { publishTicketEvent } = require("../services/event.service");

// ADD COMMENT
const addComment = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { ticketId } = req.params;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment message is required",
      });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You cannot comment on this ticket",
      });
    }

    const comment = await Comment.create({
      ticket: ticketId,
      user: req.user._id,
      message: message.trim(),
    });

    await publishTicketEvent({
      ticket: ticketId,
      performedBy: req.user._id,
      eventType: "COMMENT_ADDED",
      description: "A new comment was added to the ticket",
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "name email role",
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// GET TICKET COMMENTS
const getComments = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You cannot view these comments",
      });
    }

    const comments = await Comment.find({
      ticket: req.params.ticketId,
    })
      .populate("user", "name email role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getComments,
};
