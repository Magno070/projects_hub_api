const DiscountTable = require("../models/DiscountTable");
const Partner = require("../models/Partner");
const { isValidObjectId } = require("../../../utils/validation");

const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require("../../../utils/apiError");

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
  if (existingDiscountTableWithSameRanges && !nickname.includes("Clone")) {
    throw new ConflictError(
      `The discount table ${existingDiscountTableWithSameRanges.nickname} with these ranges already exists`
    );
  }
  _validateRanges(ranges);
  const discountTable = new DiscountTable({ nickname, discountType, ranges });
  await discountTable.save();
  return discountTable;
};

const getAllTables = async () => {
  const discountTables = await DiscountTable.find();

  if (!discountTables) throw new NotFoundError("No discount tables found");
  return discountTables;
};

const getAllPersonalTables = async () => {
  print("getAllPersonalTables");
  const personalDiscountsTables = await DiscountTable.find({
    discountType: "personal",
  });
  if (!personalDiscountsTables)
    throw new NotFoundError("No personal discount tables found");
  return personalDiscountsTables;
};

const getBaseDiscountTable = async () => {
  const baseDiscountTable = await DiscountTable.findOne({
    discountType: "base",
  });
  if (!baseDiscountTable)
    throw new NotFoundError("No base discount table found");
  return baseDiscountTable;
};

const getTableById = async (id) => {
  if (!isValidObjectId(id))
    throw new BadRequestError("Invalid discount table ID");
  const discountTable = await DiscountTable.findById(id);
  if (!discountTable) throw new NotFoundError("Discount table not found");
  return discountTable;
};

const updateTable = async (id, nickname, discountType, ranges) => {
  if (!isValidObjectId(id))
    throw new BadRequestError("Invalid discount table ID");

  const updateFields = {};
  if (typeof nickname !== "undefined" && nickname !== null) {
    updateFields.nickname = nickname;
  }
  if (typeof discountType !== "undefined" && discountType !== null) {
    updateFields.discountType = discountType;
  }
  if (typeof ranges !== "undefined" && ranges !== null) {
    _validateRanges(ranges);
    updateFields.ranges = ranges;
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

const deleteTable = async (id) => {
  if (!isValidObjectId(id))
    throw new BadRequestError("Invalid discount table ID");

  const discountTable = await DiscountTable.findById(id);
  if (!discountTable) {
    throw new NotFoundError("Discount table not found");
  }

  const baseDiscountTable = await DiscountTable.findOne({
    discountType: "base",
  });

  if (!baseDiscountTable) {
    throw new NotFoundError(
      "Base discount table not found. Cannot delete table without a base table."
    );
  }

  // Find all partners associated with the table to be deleted
  const partnersToUpdate = await Partner.find({
    discountsTableId: id,
  });

  // Update all partners to reference the base table
  if (partnersToUpdate.length > 0) {
    await Partner.updateMany(
      { discountsTableId: id },
      {
        discountsTableId: baseDiscountTable._id,
        discountType: "base",
      }
    );
  }

  await DiscountTable.findByIdAndDelete(id);

  return {
    deletedTable: discountTable,
    updatedPartners: partnersToUpdate.length,
    baseTable: baseDiscountTable,
  };
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
  getAllPersonalTables,
  getBaseDiscountTable,
  getTableById,
  updateTable,
  deleteTable,
};
