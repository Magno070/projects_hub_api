const express = require("express");
const router = express.Router();

const {
  createDiscountTable,
  getAllDiscountTables,
  getDiscountTable,
} = require("../controllers/discountTable");

router.post("/", createDiscountTable);
router.get("/all", getAllDiscountTables);
router.get("/:id", getDiscountTable);
module.exports = router;
