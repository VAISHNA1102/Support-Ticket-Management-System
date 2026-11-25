const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middleware/error.middleware");
const ticketRoutes = require("./routes/ticket.routes");
const adminRoutes = require("./routes/admin.routes");
const commentRoutes = require("./routes/comment.routes");
const activityRoutes = require("./routes/activity.routes");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Global middlewares
app.use(cors());
app.use(express.json());

// Health check API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Support Ticket Management API is running!"
  });
});


app.use("/api/auth", authRoutes);

// Global error handler (must be after routes)
app.use(errorHandler);

app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/activity", activityRoutes);

require("./events/ticket.events");

// Server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();