const express = require("express");
const router = express.Router();

const { calculatePartnerDiscounts } = require("../controllers/calculator");

router.post("/", calculatePartnerDiscounts);

module.exports = router;
