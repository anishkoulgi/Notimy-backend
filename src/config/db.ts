import mongoose from "mongoose";

require("dotenv").config();

export default () => {
  mongoose.connect(
    process.env.MONGO_URI,
    { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true },
    () => {
      console.log("Connected to DB...");
    }
  );
};
