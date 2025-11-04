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
  tableNicknameStamp: {
    type: String,
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
        type: Number,
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
        type: Number,
        required: true,
      },
      rangeTotalClientsAmount: {
        type: Number,
        required: true,
      },
      rangeTotalPrice: {
        type: Number,
        required: true,
      },
      rangeTotalDiscount: {
        type: Number,
        required: true,
      },
      rangeTotalPriceAfterDiscount: {
        type: Number,
        required: true,
      },
    },
  },
  totalPriceResult: {
    type: Number,
    required: true,
  },
  totalDiscountResult: {
    type: Number,
    required: true,
  },
  totalPriceAfterDiscountResult: {
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
