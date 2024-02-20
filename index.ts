import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import "./config/database";

dotenv.config();

const app: Application = express();

app.use(express.json());

// Routes
import authRouter from "./routes/auth.route";
import blogRouter from "./routes/blog.route";
import commentRouter from "./routes/comment.route";

// Routes Middleware
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/comments", commentRouter);

// 404 error
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: `This route ${req.originalUrl} doesn't exist`, success: false });
});

// Listen To Server
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
