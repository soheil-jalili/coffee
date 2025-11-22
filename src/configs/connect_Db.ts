const mongoose = require("mongoose");
const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }
    console.log("DB Connection Successfully ...");
    await mongoose.connect("mongodb://localhost:27017/coffee-shop");
  } catch (error) {
    console.log(`Connect To DB Failed => `, error);
  }
};

export default connectToDB;
