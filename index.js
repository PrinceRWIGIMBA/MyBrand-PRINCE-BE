"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
require("./config/database");
const server_1 = __importDefault(require("./utils/server"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path")); // Optional, for file uploads
const app = (0, server_1.default)();
dotenv_1.default.config();
// export const app: Application = express();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage: storage });
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
const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
