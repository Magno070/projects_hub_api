const DiscountTable = require("../models/DiscountTable");
const { isValidObjectId } = require("../utils/validation");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require("../utils/apiError");

const create = async ({ nickname, discountType, ranges }) => {
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

  const discountTable = new DiscountTable({ nickname, discountType, ranges });
  await discountTable.save();
  return discountTable;
};

const getAll = async () => {
  const discountTables = await DiscountTable.find();
  if (!discountTables) throw new NotFoundError("No discount tables found");
  return discountTables;
};

const getById = async (id) => {
  if (!isValidObjectId(id))
    throw new BadRequestError("Invalid discount table ID");
  const discountTable = await DiscountTable.findById(id);
  if (!discountTable) throw new NotFoundError("Discount table not found");
  return discountTable;
};

module.exports = { create, getAll, getById };
