const Ticket = require("../models/Ticket");
const User = require("../models/User");
const { publishTicketEvent } = require("../services/event.service");

// GET ALL TICKETS
const getAllTickets = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (status) {
      filter.status = status.toUpperCase();
    }

    if (priority) {
      filter.priority = priority.toUpperCase();
    }

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

    const [tickets, totalTickets] = await Promise.all([
      Ticket.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),

      Ticket.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      totalTickets,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalTickets / pageSize),
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE TICKET STATUS AND PRIORITY
const updateTicketManagement = async (req, res, next) => {
  try {
    const { status, priority } = req.body;

    const allowedStatuses = [
      "OPEN",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED"
    ];

    const allowedPriorities = [
      "LOW",
      "MEDIUM",
      "HIGH"
    ];

    if (status === undefined && priority === undefined) {
      return res.status(400).json({
        success: false,
        message: "Provide status or priority"
      });
    }

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    if (
      priority !== undefined &&
      !allowedPriorities.includes(priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority"
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    const oldStatus = ticket.status;
    const oldPriority = ticket.priority;

    if (status !== undefined) ticket.status = status;
    if (priority !== undefined) ticket.priority = priority;

    await ticket.save();

    if (oldStatus !== ticket.status) {
      await publishTicketEvent({
        ticket: ticket._id,
        performedBy: req.user._id,
        eventType: "STATUS_CHANGED",
        description: `Status changed from ${oldStatus} to ${ticket.status}`,
        metadata: {
          oldStatus,
          newStatus: ticket.status
        }
      });

      if (ticket.status === "RESOLVED") {
        await publishTicketEvent({
          ticket: ticket._id,
          performedBy: req.user._id,
          eventType: "TICKET_RESOLVED",
          description: "Ticket was resolved"
        });
      }
    }

    if (oldPriority !== ticket.priority) {
      await publishTicketEvent({
        ticket: ticket._id,
        performedBy: req.user._id,
        eventType: "PRIORITY_CHANGED",
        description: `Priority changed from ${oldPriority} to ${ticket.priority}`,
        metadata: {
          oldPriority,
          newPriority: ticket.priority
        }
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      ticket
    });
  } catch (error) {
    next(error);
  }
};

// GET DASHBOARD STATISTICS

// GET DASHBOARD STATISTICS
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalTickets,
      statusStats,
      priorityStats,
      totalUsers
    ] = await Promise.all([
      Ticket.countDocuments(),

      Ticket.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),

      Ticket.aggregate([
        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 }
          }
        }
      ]),

      User.countDocuments({ role: "USER" })
    ]);

    // Convert status statistics into easy-to-use values
    const statusCounts = {
      OPEN: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      CLOSED: 0
    };

    statusStats.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalTickets,
        totalUsers,
        openTickets: statusCounts.OPEN,
        inProgressTickets: statusCounts.IN_PROGRESS,
        resolvedTickets: statusCounts.RESOLVED,
        closedTickets: statusCounts.CLOSED,
        priorityStats
      }
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllTickets,
  updateTicketManagement,
  getDashboardStats,
};
