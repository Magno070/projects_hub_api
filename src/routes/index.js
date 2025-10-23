const express = require("express");
const router = express.Router();

const discountsRoutes = require("../features/progressive_discounts/routes/index");

// Health check route
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
    timestamp: new Date().toISOString(),
  });
});

router.use("/progressive-discounts", discountsRoutes);

module.exports = router;
