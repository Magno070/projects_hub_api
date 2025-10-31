const Partner = require("../models/Partner");
const DiscountTable = require("../models/DiscountTable");
const CalculationLog = require("../models/CalculationLog");
const { isValidObjectId } = require("../../../utils/validation");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require("../../../utils/apiError");

const createPartner = async ({
  name,
  dailyPrice,
  clientsAmount,
  discountType,
  discountsTableId,
}) => {
  if (!isValidObjectId(discountsTableId)) {
    throw new BadRequestError("Invalid discounts table ID");
  }
  if (dailyPrice <= 0) {
    throw new BadRequestError("Daily price must be a positive number");
  }
  if (clientsAmount <= 0) {
    throw new BadRequestError("Clients amount must be a positive number");
  }
  if (discountType !== "base" && discountType !== "personal") {
    throw new BadRequestError("Discount type must be 'base' or 'personal'");
  }

  const discountTable = await DiscountTable.findById(discountsTableId);
  if (!discountTable) {
    throw new NotFoundError(
      `Discounts table with ID ${discountsTableId} not found`
    );
  }

  const existingPartner = await Partner.findOne({ name });
  if (existingPartner) {
    throw new ConflictError(`Partner with name ${name} already exists`);
  }

  const partner = new Partner({
    name,
    dailyPrice,
    clientsAmount,
    discountType,
    discountsTableId,
  });

  await partner.save();

  return partner;
};

const getPartnerById = async (id) => {
  if (!isValidObjectId(id)) throw new BadRequestError("Invalid partner ID");
  const partner = await Partner.findById(id);
  if (!partner) throw new NotFoundError("Partner not found");
  return partner;
};

const getAllPartners = async () => {
  const partners = await Partner.find();
  if (!partners) throw new NotFoundError("No partners found");
  return partners;
};

const getPartnerLogs = async (partnerId) => {
  if (!isValidObjectId(partnerId))
    throw new BadRequestError("Invalid partner ID");
  const calculationLogs = await CalculationLog.find({ partnerId: partnerId });
  if (!calculationLogs) throw new NotFoundError("No calculation logs found");
  return calculationLogs;
};

const updatePartner = async (
  id,
  { name, dailyPrice, clientsAmount, discountType, discountsTableId }
) => {
  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid partner ID");
  }
  const updateFields = {};
  if (name) updateFields.name = name;
  if (dailyPrice) updateFields.dailyPrice = dailyPrice;
  if (clientsAmount) updateFields.clientsAmount = clientsAmount;
  if (discountType) updateFields.discountType = discountType;
  if (discountsTableId) updateFields.discountsTableId = discountsTableId;
  const partner = await Partner.findByIdAndUpdate(id, updateFields, {
    new: true,
  });
  if (!partner) throw new NotFoundError("Partner not found");
  return partner;
};

const deletePartner = async (id) => {
  if (!isValidObjectId(id)) throw new BadRequestError("Invalid partner ID");
  const partner = await Partner.findByIdAndDelete(id);
  if (!partner) throw new NotFoundError("Partner not found");
  return partner;
};

module.exports = {
  createPartner,
  getPartnerById,
  getAllPartners,
  getPartnerLogs,
  updatePartner,
  deletePartner,
};
