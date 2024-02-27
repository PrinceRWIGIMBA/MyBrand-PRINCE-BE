"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { createMessage, updateMessage, allMessages, getMessage, deleteMessage, } = require("../controllers/message.controller");
const authMiddlewares_1 = require("../middlwares/authMiddlewares");
const { messageValidator, } = require("../utils/validators/messageValidator");
router.post("/", messageValidator, createMessage);
router.put("/:id", authMiddlewares_1.requireSignIn, (0, authMiddlewares_1.allowedTo)("admin"), messageValidator, updateMessage);
router.get("/", authMiddlewares_1.requireSignIn, (0, authMiddlewares_1.allowedTo)("admin"), allMessages);
router.get("/:id", authMiddlewares_1.requireSignIn, (0, authMiddlewares_1.allowedTo)("admin"), getMessage);
router.delete("/:id", authMiddlewares_1.requireSignIn, (0, authMiddlewares_1.allowedTo)("admin"), deleteMessage);
exports.default = router;
