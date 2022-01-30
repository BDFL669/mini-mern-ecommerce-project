//require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");

//const MONGO_URI = "mongodb+srv://lowacase:kingpooh@cluster0.izruf.mongodb.net/commerce?retryWrites=true&w=majority"
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true
    });

    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error("MongoDB connection FAIL");
    process.exit(1);
  }
};

module.exports = connectDB;
