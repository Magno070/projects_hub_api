const mongoose = require("mongoose");
const { Schema } = mongoose;

const calculationLogSchema = new Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
  discountTableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiscountTable",
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
  details: {
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
      rangeTotalClientsAmount: {
        type: Number,
        required: true,
      },
      rangeTotalPrice: {
        type: Schema.Types.Decimal128,
        required: true,
      },
      rangeTotalDiscount: {
        type: Schema.Types.Decimal128,
        required: true,
      },
      rangeTotalPriceAfterDiscount: {
        type: Schema.Types.Decimal128,
        required: true,
      },
    },
  },
  totalPriceResult: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  totalDiscountResult: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  totalPriceAfterDiscountResult: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  calculationDate: {
    type: Date,
    default: Date.now,
  },
});

const CalculationLog = mongoose.model("CalculationLog", calculationLogSchema);

module.exports = CalculationLog;
