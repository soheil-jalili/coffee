const mongoose = require("mongoose");
require("./Product");
require("./User");

const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  date: {
    type: Date,
    default: () => Date.now(),
    immutable: false,
  },

  isAccept: {
    type: Boolean,
    default: false,
  },

  user : {
    type : mongoose.Types.ObjectId,
    ref : 'User'
  },

  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
});

const CommentModel =
  mongoose.models.Comment || mongoose.model("Comment", schema);

export default CommentModel;
