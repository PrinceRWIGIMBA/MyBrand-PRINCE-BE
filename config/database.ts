const mongoose = require("mongoose");
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URL: string = process.env.MONGODB_URL || "";

mongoose.set("strictQuery", true);

const connectOptions: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(MONGODB_URL as string  , connectOptions)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err: any) => {
    console.error("Error connecting to the database:", err);
  });
