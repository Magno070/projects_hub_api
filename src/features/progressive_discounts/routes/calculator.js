const express = require("express");
const router = express.Router();

const { calculatePartnerDiscounts } = require("../controllers/calculator");

router.post("/calculate-partner-discounts", calculatePartnerDiscounts);

module.exports = router;
