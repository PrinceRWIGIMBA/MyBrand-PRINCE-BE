"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { createBlog, updateBlog, allBlogs, getBlog, deleteBlog, likeBlog, dislikeBlog } = require("../controllers/blog.controller");
const authMiddlewares_1 = require("../middlwares/authMiddlewares");
const { createBlogValidator, updateBlogValidator, } = require("../utils/validators/blogValidator");
router.post("/", authMiddlewares_1.requireSignIn, (0, authMiddlewares_1.allowedTo)("admin"), createBlogValidator, createBlog);
router.put("/:id", authMiddlewares_1.requireSignIn, (0, authMiddlewares_1.allowedTo)("admin"), updateBlogValidator, updateBlog);
router.get("/", allBlogs);
router.get("/:id", getBlog);
router.delete("/:id", authMiddlewares_1.requireSignIn, (0, authMiddlewares_1.allowedTo)("admin"), deleteBlog);
router.post('/like/:id', authMiddlewares_1.requireSignIn, likeBlog);
router.post('/dislike/:id', authMiddlewares_1.requireSignIn, dislikeBlog);
exports.default = router;
