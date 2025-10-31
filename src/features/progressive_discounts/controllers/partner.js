const partnerService = require("../services/partner.service");
const { BadRequestError } = require("../../../utils/apiError");

const createPartnerController = async (req, res, next) => {
  const { name, dailyPrice, clientsAmount, discountType, discountsTableId } =
    req.body;
  if (
    !name ||
    !dailyPrice ||
    !clientsAmount ||
    !discountType ||
    !discountsTableId
  ) {
    throw new BadRequestError(
      "All fields are required: name, dailyPrice, clientsAmount, discountType, discountsTableId"
    );
  }
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
  const { id } = req.query;
  if (!id) throw new BadRequestError("ID parameter is required");
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

const getPartnerLogsController = async (req, res, next) => {
  const { partnerId } = req.query;
  if (!partnerId) throw new BadRequestError("Partner ID parameter is required");

  try {
    const calculationLogs = await partnerService.getPartnerLogs(partnerId);
    res.status(200).json({
      success: true,
      message: "Calculation logs fetched successfully",
      calculationLogs,
    });
  } catch (error) {
    next(error);
  }
};

const updatePartnerController = async (req, res, next) => {
  const { id } = req.query;
  if (!id) throw new BadRequestError("ID parameter is required");
  const { name, dailyPrice, clientsAmount, discountType, discountsTableId } =
    req.body;
  try {
    const partner = await partnerService.updatePartner(id, {
      name,
      dailyPrice,
      clientsAmount,
      discountType,
      discountsTableId,
    });
    res.status(200).json({
      success: true,
      message: "Partner updated successfully",
      partner,
    });
  } catch (error) {
    next(error);
  }
};

const deletePartnerController = async (req, res, next) => {
  const { id } = req.query;
  if (!id) throw new BadRequestError("ID parameter is required");
  try {
    const partner = await partnerService.deletePartner(id);
    res.status(200).json({
      success: true,
      message: "Partner deleted successfully",
      partner,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPartnerController,
  getPartnerByIdController,
  getAllPartnersController,
  getPartnerLogsController,
  updatePartnerController,
  deletePartnerController,
};
