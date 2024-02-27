import express, {Application, Request, Response, NextFunction } from "express";
import authRouter from "../routes/auth.route";
import blogRouter from "../routes/blog.route";
import commentRouter from "../routes/comment.route";
import messageRouter from "../routes/message.route"
import { create } from "domain";
function createServer(){
     const app: Application = express();
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/comments", commentRouter);
app.use("/api/messages", messageRouter);
return app;
}
export default createServer;