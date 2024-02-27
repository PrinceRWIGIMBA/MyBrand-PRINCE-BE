"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_controller_1 = require("../controllers/Auth.controller");
const authValidator_1 = require("../utils/validators/authValidator");
const router = express_1.default.Router();
router.post("/signup", authValidator_1.signupValidator, Auth_controller_1.signup);
router.post("/login", authValidator_1.loginValidator, Auth_controller_1.login);
exports.default = router;
