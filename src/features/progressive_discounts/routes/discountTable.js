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

// Post
router.post("/", createDiscountTable);

// GET
router.get("/all", getAllDiscountsTables);
router.get("/personal", getAllPersonalDiscountsTables);
router.get("/base", getBaseDiscountTable);
router.get("/", getDiscountTableById);

// PATCH
router.patch("/", updateDiscountTable);

// DELETE
router.delete("/", deleteDiscountTable);

module.exports = router;
