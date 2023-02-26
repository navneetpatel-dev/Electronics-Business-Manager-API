const mongoose = require("mongoose");

const validateMongoDBId = async (id) => {
  try {
    const isValid = await mongoose.isValidObjectId(id);
    if (!isValid) {
      throw new Error("This id is not valid or not found");
    }
  } catch (error) {
    console.log(error);
    // throw new Error("This id is not valid or not found");
  }
};

module.exports = validateMongoDBId;
