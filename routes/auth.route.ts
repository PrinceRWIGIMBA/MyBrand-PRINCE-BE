import express, { Request, Response, NextFunction, Router } from "express";
import { signup, login } from "../controllers/Auth.controller";
import { signupValidator, loginValidator } from "../utils/validators/authValidator";

const router = express.Router();

router.post("/signup", signupValidator, signup);

router.post("/login", loginValidator, login);

export default router;
