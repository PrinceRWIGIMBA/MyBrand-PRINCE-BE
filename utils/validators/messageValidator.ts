import Joi, { ValidationError } from "joi";
import { Request, Response, NextFunction } from "express";
import User from "../../model/Message";

const messageSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(2)
    .max(15)
    .required()
    .messages({
      "string.empty": "username is not allowed to be empty",
      "string.min": "username length must be at least 2 characters long",
      "string.max": "username length must be less than or equal to 15 characters long",
      "any.required": "username is required",
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
    querie: Joi.string()
    .required()
    .empty()
    .max(1500)
    .messages({
      'string.empty': 'message is not allowed to be empty',
      'string.max': 'message length must be less than or equal to {#limit} characters long',
    })
});


export const messageValidator = (req: Request, res: Response, next: NextFunction) => {
  const { error }: { error?: ValidationError } = messageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

