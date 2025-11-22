const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    } else {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("DB Connection Succesfully");
    }
  } catch (error) {
    console.log(`DB Connection Failed ${error}`);
  }
};

export default dbConnection;
