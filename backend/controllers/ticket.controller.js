const Ticket = require("../models/Ticket");
const { publishTicketEvent } = require("../services/event.service");

// CREATE TICKET
const createTicket = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      category,
      createdBy: req.user._id,
    });

    await publishTicketEvent({
      ticket: ticket._id,
      performedBy: req.user._id,
      eventType: "TICKET_CREATED",
      description: "A new support ticket was created",
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// GET MY TICKETS
const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE TICKET
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

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
        message: "You cannot access this ticket",
      });
    }

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE TICKET
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this ticket",
      });
    }

    if (ticket.status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "Only open tickets can be edited",
      });
    }

    const allowedFields = ["title", "description", "category"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        ticket[field] = req.body[field];
      }
    });

    await ticket.save();
    await publishTicketEvent({
      ticket: ticket._id,
      performedBy: req.user._id,
      eventType: "TICKET_UPDATED",
      description: "Ticket details were updated",
    });

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE TICKET
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this ticket",
      });
    }

    if (ticket.status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "Only open tickets can be deleted",
      });
    }

    await ticket.deleteOne();

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
