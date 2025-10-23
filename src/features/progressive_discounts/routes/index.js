const express = require("express");
const router = express.Router();

// Import routes
const discountsTableRoutes = require("./discountTable");

// Configure routes
router.use("/discounts-table", discountsTableRoutes);

module.exports = router;
