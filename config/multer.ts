import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// Multer config
const multerConfig = multer({
  storage: multer.diskStorage({}),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      // Pass the error object if the file type is not supported
      cb(new Error("File type is not supported"));
      return;
    }
    // Pass null if the file type is supported
    cb(null, true);
  },
});

// Define the field name for the file upload
const fieldName = "image"; // Change "image" to your desired field name

// Middleware to handle single file upload from the specified field
const singleUpload = multerConfig.single(fieldName);

export { singleUpload };
