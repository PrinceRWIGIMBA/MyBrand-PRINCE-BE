import express, { Request, Response, NextFunction, Router } from "express";
import { signup, login,getAllUsers,logout } from "../controllers/Auth.controller";
import { signupValidator, loginValidator } from "../utils/validators/authValidator";
import { requireSignIn, allowedTo} from "../middlwares/authMiddlewares";

const router = express.Router();

router.post("/signup", signupValidator, signup);

router.post("/login", loginValidator, login);
router.post("/logout",requireSignIn, logout);
router.get("/Users", requireSignIn,allowedTo("admin"), getAllUsers);

export default router;
