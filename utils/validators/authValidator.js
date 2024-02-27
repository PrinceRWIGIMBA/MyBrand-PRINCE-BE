"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.signupValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const User_1 = __importDefault(require("../../model/User"));
const signupSchema = joi_1.default.object({
    firstname: joi_1.default.string()
        .trim()
        .min(2)
        .max(15)
        .required()
        .messages({
        "string.empty": "firstname is not allowed to be empty",
        "string.min": "firstname length must be at least 2 characters long",
        "string.max": "firstname length must be less than or equal to 15 characters long",
        "any.required": "firstname is required",
    }),
    lastname: joi_1.default.string()
        .trim()
        .min(2)
        .max(15)
        .required()
        .messages({
        "string.empty": "lastname is not allowed to be empty",
        "string.min": "lastname length must be at least 2 characters long",
        "string.max": "lastname length must be less than or equal to 15 characters long",
        "any.required": "lastname is required",
    }),
    email: joi_1.default.string()
        .trim()
        .email()
        .max(40)
        .required()
        .custom((value, helpers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({ email: value });
            if (user) {
                return helpers.error("any.custom", { message: "User already exists" });
            }
            return value;
        }
        catch (error) {
            throw new Error(error);
        }
    }))
        .messages({
        "string.empty": "email is not allowed to be empty",
        "string.email": "Email must be a valid email",
        "string.max": "email length must be less than or equal to 40 characters long",
        "any.required": "email is required",
    }),
    password: joi_1.default.string()
        .trim()
        .min(5)
        .required()
        .messages({
        "string.empty": "password is not allowed to be empty",
        "string.min": "password length must be at least 5 characters long",
        "any.required": "password is required",
    }),
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .trim()
        .email()
        .required()
        .messages({
        "string.empty": "Email is not allowed to be empty",
        "string.email": "Email must be a valid email",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string()
        .trim()
        .required()
        .messages({
        "string.empty": "password is not allowed to be empty",
        "any.required": "password is required",
    }),
});
const signupValidator = (req, res, next) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.signupValidator = signupValidator;
const loginValidator = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.loginValidator = loginValidator;
