const {
  ticketEventEmitter
} = require("../services/event.service");

const ActivityLog = require("../models/ActivityLog");

ticketEventEmitter.on(
  "ticket-event",
  async (eventData, callback) => {
    try {
      const activity = await ActivityLog.create(eventData);

      console.log(
        `Event processed: ${eventData.eventType}`
      );

      callback(null, activity);
    } catch (error) {
      console.error("Event processing failed:", error.message);
      callback(error);
    }
  }
);