import express, {Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import "./config/database";
import createServer from "./utils/server";
import multer from 'multer';
import path from 'path'; // Optional, for file uploads


const app =createServer();

dotenv.config();

// export const app: Application = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// app.use(express.json());


// Routes
// import authRouter from "./routes/auth.route";
// import blogRouter from "./routes/blog.route";
// import commentRouter from "./routes/comment.route";
// import messageRouter from "./routes/message.route"
// import { create } from "domain";

// Routes Middleware
// app.use("/api/auth", authRouter);
// app.use("/api/blogs", blogRouter);
// app.use("/api/comments", commentRouter);
// app.use("/api/messages", messageRouter);

// // 404 error
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   res.status(404).json({ message: `This route ${req.originalUrl} doesn't exist`, success: false });
// });

// // Listen To Server
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  
});
