const express = require("express");
const router = express.Router();

// Import routes
const discountsTableRoutes = require("./discountTable");
const partnerRoutes = require("./partner");
const calculatorRoutes = require("./calculator");

// Configure routes
router.use("/discounts-table", discountsTableRoutes);
router.use("/partner", partnerRoutes);
router.use("/calculator", calculatorRoutes);

module.exports = router;
