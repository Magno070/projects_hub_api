const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import routes
const routes = require("./src/routes/index");

// Connect to MongoDB
mongoose
  .connect(process.env.URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

const app = express();

// Global middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api", routes);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is working!",
    endpoints: {
      auth: "/api/auth",
      projects: "/api/projects",
      health: "/api/health",
    },
  });
});

// Not found route middleware
app.use("", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
const errorMiddleware = require("./src/middleware/errorMiddleware");
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 Documentation available at http://localhost:${PORT}`);
});
