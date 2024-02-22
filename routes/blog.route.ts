import express from "express";
import { upload } from "../config/multer";



const router = express.Router();

const {createBlog,updateBlog,allBlogs,getBlog,deleteBlog,likeBlog,dislikeBlog} = require("../controllers/blog.controller");

import { requireSignIn, allowedTo} from "../middlwares/authMiddlewares";

const {
  createBlogValidator,
  updateBlogValidator,
} = require("../utils/validators/blogValidator");


router.post("/", requireSignIn, allowedTo("admin"), createBlogValidator, createBlog);



router.put(
  "/:id",
  requireSignIn,
  allowedTo("admin"),
  updateBlogValidator,
  updateBlog
);



router.get("/", allBlogs);


router.get(
  "/:id", getBlog);


router.delete(
  "/:id",
  requireSignIn,
  allowedTo("admin"),
  deleteBlog
);







router.post('/like/:id',requireSignIn, likeBlog);


router.post('/dislike/:id',requireSignIn, dislikeBlog);



export default router;
