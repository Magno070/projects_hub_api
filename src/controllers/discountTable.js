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

const getAllDiscountTables = async (req, res, next) => {
  try {
    const discountTables = await discountTableService.getAll();
    res.status(200).json({
      success: true,
      message: "Discount tables fetched successfully",
      discountTables,
    });
  } catch (error) {
    next(error);
  }
};

const getDiscountTable = async (req, res, next) => {
  const { id } = req.params;
  try {
    const discountTable = await discountTableService.getById(id);
    res.status(200).json({
      success: true,
      message: "Discount table fetched successfully",
      data: {
        discountTable,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDiscountTable,
  getAllDiscountTables,
  getDiscountTable,
};
