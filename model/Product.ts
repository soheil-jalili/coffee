const mongoose = require("mongoose");
require("./Comment");

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
    required: true,
  },

  weight: {
    type: Number,
    required: true,
  },

  suitableFor: {
    type: String,
    required: true,
  },
  smell: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 5,
    min: 1,
    max: 5,
  },

  comments: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  },

  tags: {
    type: [String],
    required: true,
  },
});

const ProductModel =
  mongoose.models.Product || mongoose.model("Product", schema);

export default ProductModel;
