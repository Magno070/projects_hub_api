const express = require("express");
const router = express.Router();

// Import routes
const discountsTableRoutes = require("./discountTable");
const partnerRoutes = require("./partner");

// Configure routes
router.use("/discounts-table", discountsTableRoutes);
router.use("/partner", partnerRoutes);

module.exports = router;
