const mongoose = require("mongoose");
require("./Product");
require("./User");

const schema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    percent: {
      type: Number,
      required: true,
    },
    maxUse: {
      type: Number,
      required: true,
    },
    uses: {
      type: Number,
      default: 0,
    },

    product: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Product",
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const DiscountModel =
  mongoose.models.Discount || mongoose.model("Discount", schema);

export default DiscountModel;
