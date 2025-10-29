const calculatorService = require("../services/calculator.service");

const calculatePartnerDiscounts = async (req, res, next) => {
  const { partnerId, discountTableId } = req.body;
  try {
    const calculationLog = await calculatorService.calculatePartnerDiscounts(
      partnerId,
      discountTableId
    );
    res.status(200).json({
      success: true,
      message: "Discount calculated successfully",
      calculationLog,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculatePartnerDiscounts,
};
