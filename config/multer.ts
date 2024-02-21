import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";


const multerConfig = multer({
  storage: multer.diskStorage({}),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      
      cb(new Error("File type is not supported"));
      return;
    }

    cb(null, true);
  },
});

const fieldName = "image"; 


const singleUpload = multerConfig.single(fieldName);

export { singleUpload };
