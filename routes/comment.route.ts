import express from "express";
const router = express.Router();

const {
  createComment,
  updateComment,
  getComment,
  allComments,
  deleteComment,
} = require("../controllers/comment.controller");

import { requireSignIn, allowedTo } from "../middlwares/authMiddlewares";

//create comment
router.post("/", requireSignIn, allowedTo("user", "admin"), createComment);

//update comment
router.put(
  "/:id",
  requireSignIn,
  allowedTo("user", "admin"),
  updateComment
);

//delete comment
router.delete(
  "/:id",
  requireSignIn,
  allowedTo("user", "admin"),
  deleteComment
);

//get a single comment
router.get("/:id", getComment);

//get all comment
router.get("/", allComments);

export default router;
