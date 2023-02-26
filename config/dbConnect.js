const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database Error", error);
  }
};

module.exports = dbConnect;
