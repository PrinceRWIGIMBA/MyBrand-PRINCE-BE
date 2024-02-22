import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  let ext = path.extname(file.originalname);
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
       cb(new Error("File type is not supported"));
      return;
  }
  cb(null, true);
};

const multerConfig = multer({ storage: storage, fileFilter: fileFilter });

const upload = multerConfig.any();

export { upload };
