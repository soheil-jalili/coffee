const mongoose = require("mongoose");
require("./Comment");

const schema = mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expTime: {
    type: Number,
    required: true,
  },
  times: {
    type: Number,
    default: 0,
  },
});

const OtpModel = mongoose.models.Otp || mongoose.model("Otp", schema);

export default OtpModel;
