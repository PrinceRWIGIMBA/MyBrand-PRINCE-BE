"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URL = process.env.MONGODB_URL || "";
mongoose.set("strictQuery", true);
const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose
    .connect(MONGODB_URL, connectOptions)
    .then(() => {
    console.log("Connected to the database!");
})
    .catch((err) => {
    console.error("Error connecting to the database:", err);
});
