const DiscountTable = require("../models/DiscountTable");
const discountTableService = require("../services/discountTable.service");

const createDiscountTable = async (req, res, next) => {
  const { nickname, discountType, ranges } = req.body;

  try {
    const discountTable = await discountTableService.create({
      nickname,
      discountType,
      ranges,
    });
    res.status(201).json({
      success: true,
      message: "Discount table created successfully",
      discountTable,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDiscountTables = async (req, res) => {
  try {
    const discountTables = await DiscountTable.find();
    res.status(200).json({
      success: true,
      message: "Discount tables fetched successfully",
      discountTables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getDiscountTable = async (req, res) => {
  const { id } = req.params;
  try {
    const discountTable = await DiscountTable.findById(id);
    if (!discountTable) {
      return res.status(404).json({
        success: false,
        message: "Discount table not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Discount table fetched successfully",
      discountTable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
module.exports = {
  createDiscountTable,
  getAllDiscountTables,
  getDiscountTable,
};
