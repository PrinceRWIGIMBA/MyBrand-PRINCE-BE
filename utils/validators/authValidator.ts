import Joi, { ValidationError } from "joi";
import { Request, Response, NextFunction } from "express";
import User from "../../model/User";

const signupSchema = Joi.object({
  firstname: Joi.string()
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
  lastname: Joi.string()
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
  email: Joi.string()
    .trim()
    .email()
    .max(40)
    .required()
    .custom(async (value, helpers) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return helpers.error("any.custom", { message: "User already exists" });
        }
        return value;
      } catch (error: any) {
        throw new Error(error);
      }
    })
    .messages({
      "string.empty": "email is not allowed to be empty",
      "string.email": "Email must be a valid email",
      "string.max": "email length must be less than or equal to 40 characters long",
      "any.required": "email is required",
    }),
  password: Joi.string()
    .trim()
    .min(5)
    .required()
    .messages({
      "string.empty": "password is not allowed to be empty",
      "string.min": "password length must be at least 5 characters long",
      "any.required": "password is required",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.empty": "Email is not allowed to be empty",
      "string.email": "Email must be a valid email",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "password is not allowed to be empty",
      "any.required": "password is required",
    }),
});

export const signupValidator = (req: Request, res: Response, next: NextFunction) => {
  const { error }: { error?: ValidationError } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { error }: { error?: ValidationError } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
