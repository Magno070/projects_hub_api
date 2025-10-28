const CalculationLog = require("../models/CalculationLog");
const Partner = require("../models/Partner");
const DiscountTable = require("../models/DiscountTable");

const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require("../../../utils/apiError");

const calculatePartnerClientsDiscountedPrice = async (
  partnerId,
  discountTableId
) => {
  if (!isValidObjectId(partnerId))
    throw new BadRequestError("Invalid partner ID");
  if (!isValidObjectId(discountTableId))
    throw new BadRequestError("Invalid discount table ID");

  const partner = await Partner.findById(partnerId);
  if (!partner) throw new NotFoundError("Partner not found");
  const discountTable = await DiscountTable.findById(discountTableId);
  if (!discountTable) throw new NotFoundError("Discount table not found");
  const discountRanges = discountTable.ranges;
  const discountRange = discountRanges.find(
    (range) =>
      partner.clientsAmount >= range.initialRange &&
      partner.clientsAmount <= range.finalRange
  );
  if (!discountRange) throw new NotFoundError("Discount range not found");
  const discountedPrice = partner.dailyPrice * (1 - discountRange.discount);
  return discountedPrice;
};
