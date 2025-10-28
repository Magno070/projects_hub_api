const discountTableService = require("../services/discountTable.service");

const createDiscountTable = async (req, res, next) => {
  const { nickname, discountType, ranges } = req.body;
  try {
    const discountTable = await discountTableService.createTable({
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

const getAllDiscountsTables = async (req, res, next) => {
  try {
    const discountTables = await discountTableService.getAllTables();

    res.status(200).json({
      success: true,
      message: "Discount tables fetched successfully",
      discountTables: discountTables,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPersonalDiscountsTables = async (req, res, next) => {
  try {
    const personalDiscountsTables =
      await discountTableService.getAllPersonalTables();
    res.status(200).json({
      success: true,
      message: "Personal discount tables fetched successfully",
      personalDiscountsTables,
    });
  } catch (error) {
    next(error);
  }
};

const getBaseDiscountTable = async (req, res, next) => {
  try {
    const baseDiscountTable = await discountTableService.getBaseDiscountTable();
    res.status(200).json({
      success: true,
      message: "Base discount table fetched successfully",
      baseDiscountTable,
    });
  } catch (error) {
    next(error);
  }
};

const getDiscountTableById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const discountTable = await discountTableService.getTableById(id);
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

const updateDiscountTable = async (req, res, next) => {
  const { id } = req.params;
  const { nickname, discountType, ranges } = req.body;
  try {
    const discountTable = await discountTableService.updateTable(
      id,
      nickname,
      discountType,
      ranges
    );
    res.status(200).json({
      success: true,
      message: "Discount table updated successfully",
      discountTable,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDiscountTable = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await discountTableService.deleteTable(id);
    res.status(200).json({
      success: true,
      message: "Discount table deleted successfully",
      data: {
        deletedTable: result.deletedTable,
        updatedPartners: result.updatedPartners,
        baseTable: result.baseTable,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDiscountTable,
  getAllDiscountsTables,
  getAllPersonalDiscountsTables,
  getBaseDiscountTable,
  getDiscountTableById,
  updateDiscountTable,
  deleteDiscountTable,
};
