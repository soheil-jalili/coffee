const mongoose = require("mongoose");
require("./User");
require("./Product");

const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WhishlistModel =
  mongoose.models.Whishlist || mongoose.model("Whishlist", schema);

export default WhishlistModel;
