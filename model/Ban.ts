const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const BanModel = mongoose.models.Ban || mongoose.model("Ban", schema);

export default BanModel;
