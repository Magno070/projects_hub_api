const partnerService = require("../services/partner.service");
const {
  createPartner,
  getPartnerById,
  getAllPartners,
} = require("../services/partner.service");

const createPartnerController = async (req, res, next) => {
  const { name, dailyPrice, clientsAmount, discountType, discountsTableId } =
    req.body;
  try {
    const partner = await partnerService.createPartner({
      name,
      dailyPrice,
      clientsAmount,
      discountType,
      discountsTableId,
    });
    res.status(201).json({
      success: true,
      message: "Partner created successfully",
      partner,
    });
  } catch (error) {
    next(error);
  }
};

const getPartnerByIdController = async (req, res, next) => {
  const { id } = req.params;
  try {
    const partner = await partnerService.getPartnerById(id);
    res.status(200).json({
      success: true,
      message: "Partner fetched successfully",
      partner,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPartnersController = async (req, res, next) => {
  try {
    const partners = await partnerService.getAllPartners();
    res.status(200).json({
      success: true,
      message: "Partners fetched successfully",
      partners,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPartnerController,
  getPartnerByIdController,
  getAllPartnersController,
};
