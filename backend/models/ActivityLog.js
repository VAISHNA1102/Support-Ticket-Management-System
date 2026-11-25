const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    eventType: {
      type: String,
      enum: [
        "TICKET_CREATED",
        "TICKET_UPDATED",
        "TICKET_DELETED",
        "STATUS_CHANGED",
        "PRIORITY_CHANGED",
        "COMMENT_ADDED",
        "TICKET_RESOLVED"
      ],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

activityLogSchema.index({ ticket: 1, createdAt: -1 });

const ActivityLog = mongoose.model(
  "ActivityLog",
  activityLogSchema
);

module.exports = ActivityLog;