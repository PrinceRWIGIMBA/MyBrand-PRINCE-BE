import express from "express";
const router = express.Router();

const {createBlog,updateBlog,allBlogs,getBlog,deleteBlog,} = require("../controllers/blog.controller");

import { requireSignIn, allowedTo} from "../middlwares/authMiddlewares";

const {
  createBlogValidator,
  updateBlogValidator,
} = require("../utils/validators/blogValidator");

// Create Blog
router.post("/", requireSignIn, allowedTo("admin"), createBlogValidator, createBlog);

// Update Blog

router.put(
  "/:id",
  requireSignIn,
  allowedTo("admin"),
  updateBlogValidator,
  updateBlog
);

// get all Blog

router.get("/", requireSignIn, allBlogs);

// get a single Blog

router.get(
  "/:id", getBlog);

// Delete a Blog
router.delete(
  "/:id",
  requireSignIn,
  allowedTo("admin"),
  deleteBlog
);

export default router;
