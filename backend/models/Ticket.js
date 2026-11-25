const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Ticket title is required"],
      trim: true,
      minlength: 5,
      maxlength: 100
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 10
    },

    category: {
      type: String,
      enum: ["TECHNICAL", "BILLING", "GENERAL", "OTHER"],
      required: true
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM"
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

ticketSchema.index({ createdBy: 1, createdAt: -1 });
ticketSchema.index({ status: 1, priority: 1 });

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;