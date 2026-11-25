const EventEmitter = require("events");

const ticketEventEmitter = new EventEmitter();

const publishTicketEvent = (eventData) => {
  return new Promise((resolve, reject) => {
    ticketEventEmitter.emit(
      "ticket-event",
      eventData,
      (error, activity) => {
        if (error) {
          reject(error);
        } else {
          resolve(activity);
        }
      }
    );
  });
};

module.exports = {
  ticketEventEmitter,
  publishTicketEvent
};