const DiscountTable = require("../models/DiscountTable");
const { isValidObjectId } = require("../../../utils/validation");

const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require("../../../utils/apiError");

/**
 * Create a new discount table
 * @param {Object} data - The discount table data
 * @param {string} data.nickname - The nickname of the discount table
 * @param {string} data.discountType - The type of discount
 * @param {Array} data.ranges - The ranges of the discount table
 * @returns {Promise<DiscountTable>}
 */
const createTable = async ({ nickname, discountType, ranges }) => {
  const existingDiscountTable = await DiscountTable.findOne({
    nickname: nickname,
  });
  if (existingDiscountTable) {
    throw new ConflictError("Discount table with this nickname already exists");
  }
  const existingDiscountTableWithSameRanges = await DiscountTable.findOne({
    ranges: ranges,
  });
  if (existingDiscountTableWithSameRanges) {
    throw new ConflictError(
      `The discount table ${existingDiscountTableWithSameRanges.nickname} with these ranges already exists`
    );
  }
  _validateRanges(ranges);
  const discountTable = new DiscountTable({ nickname, discountType, ranges });
  await discountTable.save();
  return discountTable;
};

/**
 * Get all discount tables
 * @returns {Promise<Array<DiscountTable>>}
 */
const getAllTables = async () => {
  const discountTables = await DiscountTable.find();
  if (!discountTables) throw new NotFoundError("No discount tables found");
  return discountTables;
};

/**
 * Get a discount table by ID
 * @param {string} id - The ID of the discount table
 * @returns {Promise<DiscountTable>}
 */
const getTableById = async (id) => {
  if (!isValidObjectId(id))
    throw new BadRequestError("Invalid discount table ID");
  const discountTable = await DiscountTable.findById(id);
  if (!discountTable) throw new NotFoundError("Discount table not found");
  return discountTable;
};

/**
 * Update a discount table
 * @param {string} id - The ID of the discount table
 * @param {Object} data - The fields to update
 * @returns {Promise<DiscountTable>}
 */
const updateTable = async (id, data) => {
  if (!isValidObjectId(id))
    throw new BadRequestError("Invalid discount table ID");

  const updateFields = {};
  if (typeof data.nickname !== "undefined")
    updateFields.nickname = data.nickname;
  if (typeof data.discountType !== "undefined")
    updateFields.discountType = data.discountType;
  if (typeof data.ranges !== "undefined") {
    _validateRanges(data.ranges);
    updateFields.ranges = data.ranges;
  }

  if (Object.keys(updateFields).length === 0) {
    throw new BadRequestError("No valid fields provided for update");
  }

  const discountTable = await DiscountTable.findByIdAndUpdate(
    id,
    { $set: updateFields },
    {
      new: true,
    }
  );
  if (!discountTable) throw new NotFoundError("Discount table not found");
  return discountTable;
};

/**
 * Delete a discount table
 * @param {string} id - The ID of the discount table
 * @returns {Promise<void>}
 */
const deleteTable = async (id) => {
  if (!isValidObjectId(id))
    throw new BadRequestError("Invalid discount table ID");
  await DiscountTable.findByIdAndDelete(id);
};

const _validateRanges = (ranges) => {
  if (!Array.isArray(ranges))
    throw new BadRequestError("Ranges must be an array");
  for (const range of ranges) {
    if (
      range.initialRange >= range.finalRange ||
      range.initialRange < 0 ||
      range.finalRange < 0
    ) {
      throw new BadRequestError(
        "Initial range must be less than final range and both must be greater than 0"
      );
    }
    if (range.discount < 0 || range.discount > 100) {
      throw new BadRequestError("Discount must be between 0 and 100");
    }
  }
};

module.exports = {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable,
};
