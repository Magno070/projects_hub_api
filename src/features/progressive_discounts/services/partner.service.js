const mongoose = require("mongoose");
const Partner = require("../models/Partner");
const DiscountTable = require("../models/DiscountTable"); // <-- 1. Importar o modelo para verificação
const { isValidObjectId } = require("../../../utils/validation");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require("../../../utils/apiError");

/**
 * Create a new partner
 * @param {string} name - The name of the partner
 * @param {number} dailyPrice - The daily price of the partner
 * @param {number} clientsAmount - The number of clients of the partner
 * @param {string} discountType - The type of discount of the partner
 * @param {string} discountsTableId - The id of the discounts table of the partner
 * @returns {Promise<Partner>}
 */
const createPartner = async ({
  name,
  dailyPrice,
  clientsAmount,
  discountType,
  discountsTableId,
}) => {
  // Validações rápidas (fora da transação)
  if (!isValidObjectId(discountsTableId)) {
    throw new BadRequestError("Invalid discounts table ID");
  }
  if (typeof dailyPrice !== "number" || dailyPrice <= 0) {
    throw new BadRequestError("Daily price must be a positive number");
  }
  if (typeof clientsAmount !== "number" || clientsAmount <= 0) {
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

/**
 * Get a partner by ID
 * @param {string} id - The ID of the partner
 * @returns {Promise<Partner>}
 */
const getPartnerById = async (id) => {
  if (!isValidObjectId(id)) throw new BadRequestError("Invalid partner ID");
  const partner = await Partner.findById(id);
  if (!partner) throw new NotFoundError("Partner not found");
  return partner;
};

/**
 * Get all partners
 * @returns {Promise<Array<Partner>>}
 */
const getAllPartners = async () => {
  const partners = await Partner.find();
  if (!partners) throw new NotFoundError("No partners found");
  return partners;
};

module.exports = {
  createPartner,
  getPartnerById,
  getAllPartners,
};
