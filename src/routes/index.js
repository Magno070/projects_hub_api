const express = require("express");
const router = express.Router();

// Import routes
// const exampleRoutes = require("./routesExample");

// Configure routes
// router.use("/example", exampleRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
