const mongoose = require("mongoose");
const { Schema } = mongoose;

const discountSchema = new mongoose.Schema({
  nickname: {
    type: String,
    trim: true,
    minLength: [3, "Nickname must be at least 3 characters"],
    maxLength: [100, "Nickname must be at most 100 characters"],
    unique: true,
    required: true,
  },
  discountType: {
    type: String,
    enum: ["base", "personal"],
    default: "personal",
    required: true,
  },
  ranges: {
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
  },
});

module.exports = mongoose.model("DiscountTable", discountSchema);
