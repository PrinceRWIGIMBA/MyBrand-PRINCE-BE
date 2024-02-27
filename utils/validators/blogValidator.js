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
exports.updateBlogValidator = exports.createBlogValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const validMongodbObjectid_1 = __importDefault(require("../validMongodbObjectid"));
const createBlogValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        title: joi_1.default.string()
            .required()
            .empty()
            .min(5)
            .max(100)
            .messages({
            'string.empty': 'title is not allowed to be empty',
            'string.min': 'title length must be at least {#limit} characters long',
            'string.max': 'title length must be less than or equal to {#limit} characters long',
        }),
        description: joi_1.default.string()
            .required()
            .empty()
            .max(1500)
            .messages({
            'string.empty': 'description is not allowed to be empty',
            'string.max': 'description length must be less than or equal to {#limit} characters long',
        }),
        contents: joi_1.default.string()
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
});
exports.createBlogValidator = createBlogValidator;
const updateBlogValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        id: joi_1.default.string()
            .required()
            .empty()
            .custom((value, helpers) => {
            if (!(0, validMongodbObjectid_1.default)(req.params.id)) {
                throw new Error(`Invalid Blog id format`);
            }
            return value;
        }),
        title: joi_1.default.string()
            .optional()
            .empty()
            .min(2)
            .max(20)
            .messages({
            'string.min': 'title length must be at least {#limit} characters long',
            'string.max': 'title length must be less than or equal to {#limit} characters long',
        }),
        description: joi_1.default.string()
            .optional()
            .empty()
            .min(2)
            .max(600)
            .messages({
            'string.min': 'description length must be at least {#limit} characters long',
            'string.max': 'description length must be less than or equal to {#limit} characters long',
        }),
        contents: joi_1.default.string()
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
});
exports.updateBlogValidator = updateBlogValidator;
