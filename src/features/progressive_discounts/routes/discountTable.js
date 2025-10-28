const express = require("express");
const router = express.Router();

const {
  createDiscountTable,
  getAllDiscountsTables,
  getAllPersonalDiscountsTables,
  getBaseDiscountTable,
  getDiscountTableById,
  updateDiscountTable,
  deleteDiscountTable,
} = require("../controllers/discountTable");

router.post("/", createDiscountTable);
router.get("/all", getAllDiscountsTables);
router.get("/personal", getAllPersonalDiscountsTables);
router.get("/base", getBaseDiscountTable);
router.get("/:id", getDiscountTableById);
router.patch("/:id", updateDiscountTable);
router.delete("/:id", deleteDiscountTable);

module.exports = router;
