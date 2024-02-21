import express from "express";
const router = express.Router();

const {createMessage,updateMessage,allMessages,getMessage,deleteMessage,} = require("../controllers/message.controller");

import { requireSignIn, allowedTo} from "../middlwares/authMiddlewares";

const {
  messageValidator,
 
} = require("../utils/validators/messageValidator");


router.post("/", messageValidator, createMessage);


router.put(
  "/:id",
  requireSignIn,
  allowedTo("admin"),
  messageValidator,
  updateMessage
);



router.get("/",  requireSignIn,
allowedTo("admin"),allMessages);


router.get(
  "/:id", requireSignIn,
  allowedTo("admin"), getMessage);


router.delete(
  "/:id",
  requireSignIn,
  allowedTo("admin"),
  deleteMessage
);

export default router;
