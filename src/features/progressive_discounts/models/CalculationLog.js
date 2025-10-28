const mongoose = require("mongoose");
const { Schema } = mongoose;

const calculationLogSchema = new Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
  partnerDailyPriceStamp: {
    type: Number,
    required: true,
  },
  partnerClientsAmountStamp: {
    type: Number,
    required: true,
  },
  discountTableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiscountTable",
    required: true,
  },
  discountRangesStamp: {
    type: [Object],
    of: {
      initialRange: {
        type: Number,
        required: true,
      },
      finalRange: {
        type: Number,
        required: true,
      },
      discount: {
        type: Schema.Types.Decimal128,
        required: true,
      },
    },
    required: true,
  },
  calculationResult: {
    type: Number,
    required: true,
  },
  calculationDate: {
    type: Date,
    default: Date.now,
  },
});

const CalculationLog = mongoose.model("CalculationLog", calculationLogSchema);

module.exports = CalculationLog;
