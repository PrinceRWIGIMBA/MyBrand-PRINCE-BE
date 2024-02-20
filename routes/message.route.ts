import express from "express";
const router = express.Router();

const {createMessage,updateMessage,allMessages,getMessage,deleteMessage,} = require("../controllers/message.controller");

import { requireSignIn, allowedTo} from "../middlwares/authMiddlewares";

const {
  createBlogValidator,
  updateBlogValidator,
} = require("../utils/validators/blogValidator");

// Create Blog
router.post("/", createBlogValidator, createMessage);

// Update Blog

router.put(
  "/:id",
  requireSignIn,
  allowedTo("admin"),
  updateBlogValidator,
  updateMessage
);

// get all Blog

router.get("/", requireSignIn,  requireSignIn,
allowedTo("admin"),allMessages);

// get a single Blog

router.get(
  "/:id", requireSignIn,
  allowedTo("admin"), getMessage);

// Delete a Blog
router.delete(
  "/:id",
  requireSignIn,
  allowedTo("admin"),
  deleteMessage
);

export default router;
