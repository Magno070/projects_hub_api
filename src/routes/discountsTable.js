const express = require("express");
const router = express.Router();

const {
  createDiscountTable,
  getAllDiscountTables,
  getDiscountTable,
} = require("../controllers/discountTable");

router.post("/", createDiscountTable);
router.get("/", getAllDiscountTables);
router.get("/:id", getDiscountTable);
module.exports = router;
