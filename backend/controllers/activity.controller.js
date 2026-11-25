const ActivityLog = require("../models/ActivityLog");
const Ticket = require("../models/Ticket");

const getTicketActivity = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    const isOwner =
      ticket.createdBy.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You cannot view this activity"
      });
    }

    const activities = await ActivityLog.find({
      ticket: ticketId
    })
      .populate("performedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTicketActivity };