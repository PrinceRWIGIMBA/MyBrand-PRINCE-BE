import { RequestHandler, Request, Response, NextFunction } from 'express';
import Joi, { CustomHelpers } from 'joi';
import isValidObjectId from '../validMongodbObjectid';

interface ValidatorMiddleware extends RequestHandler {
  (req: RequestWithValidation, res: Response, next: NextFunction): any;
}

interface RequestWithValidation extends Request {
  validationErrors?: any;
}

const createBlogValidator: ValidatorMiddleware = async (req: RequestWithValidation, res, next) => {
  const schema = Joi.object({
    title: Joi.string()
      .required()
      .empty()
      .min(5)
      .max(100)
      .messages({
        'string.empty': 'title is not allowed to be empty',
        'string.min': 'title length must be at least {#limit} characters long',
        'string.max': 'title length must be less than or equal to {#limit} characters long',
      }),
    description: Joi.string()
      .required()
      .empty()
      .max(1500)
      .messages({
        'string.empty': 'description is not allowed to be empty',
        'string.max': 'description length must be less than or equal to {#limit} characters long',
      }),
    contents: Joi.string()
      .required()
      .empty()
      .max(1500)
      .messages({
        'string.empty': 'content is not allowed to be empty',
        'string.max': 'content length must be less than or equal to {#limit} characters long',
      })
  });
//console.log(req.body)
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    req.validationErrors = error.details.map((err) => err.message);
  }
  next();
};


const updateBlogValidator: ValidatorMiddleware = async (req: RequestWithValidation, res, next) => {
  const schema = Joi.object({
    id: Joi.string()
      .required()
      .empty()
      .custom((value, helpers) => {
        if (!isValidObjectId(req.params.id)) {
          throw new Error(`Invalid Blog id format`);
        }
        return value;
      }),
    title: Joi.string()
      .optional()
      .empty()
      .min(2)
      .max(20)
      .messages({
        'string.min': 'title length must be at least {#limit} characters long',
        'string.max': 'title length must be less than or equal to {#limit} characters long',
      }),
    description: Joi.string()
      .optional()
      .empty()
      .min(2)
      .max(600)
      .messages({
        'string.min': 'description length must be at least {#limit} characters long',
        'string.max': 'description length must be less than or equal to {#limit} characters long',
      }),
      contents: Joi.string()
      .optional()
      .empty()
      .min(2)
      .max(600)
      .messages({
        'string.min': 'content length must be at least {#limit} characters long',
        'string.max': 'content length must be less than or equal to {#limit} characters long',
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    req.validationErrors = error.details.map((err) => err.message);
  }
  next();
};

export { createBlogValidator, updateBlogValidator };
