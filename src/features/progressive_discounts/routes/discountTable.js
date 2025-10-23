const express = require("express");
const router = express.Router();

const {
  createDiscountTable,
  getAllDiscountTables,
  getDiscountTableById,
  updateDiscountTable,
  deleteDiscountTable,
} = require("../controllers/discountTable");

router.post("/", createDiscountTable);
router.get("/all", getAllDiscountTables);
router.get("/:id", getDiscountTableById);
router.patch("/:id", updateDiscountTable);
router.delete("/:id", deleteDiscountTable);
module.exports = router;
