const express = require("express");
const router = express.Router();

// Import routes
const discountsTableRoutes = require("./discountsTable");

// Configure routes
router.use("/discounts-table", discountsTableRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
