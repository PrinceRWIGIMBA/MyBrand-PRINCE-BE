import express from "express";
import { singleUpload } from "../config/multer";
// blogRoutes.ts


const router = express.Router();

const {createBlog,updateBlog,allBlogs,getBlog,deleteBlog,likeBlog,dislikeBlog} = require("../controllers/blog.controller");

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

router.get("/", allBlogs);

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






// Like a Blog
router.post('/like/:id',requireSignIn, likeBlog);

// Dislike a Blog
router.post('/dislike/:id',requireSignIn, dislikeBlog);



export default router;
