const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minLength: [3, "Name must be at least 3 characters"],
    maxLength: [100, "Name must be at most 100 characters"],
    required: true,
  },
  dailyPrice: {
    type: Number,
    required: true,
  },
  clientsAmount: {
    type: Number,
    required: true,
  },
  discountType: {
    type: String,
    enum: ["base", "personal"],
    default: "base",
    required: true,
  },
  discountsTableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiscountTable",
    required: true,
  },
});
