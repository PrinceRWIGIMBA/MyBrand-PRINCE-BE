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


router.post('/:blogId',requireSignIn, allowedTo("user", "admin"), createComment);



router.put(
  "/:id",
  requireSignIn,
  allowedTo("user", "admin"),
  updateComment
);

router.delete(
  "/:id",
  requireSignIn,
  allowedTo("user", "admin"),
  deleteComment
);


router.get("/:id", getComment);


router.get("/", allComments);

export default router;
