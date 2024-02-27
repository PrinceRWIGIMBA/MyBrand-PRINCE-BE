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
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../utils/generateToken");
const User_1 = __importDefault(require("../model/User"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password } = req.body;
    try {
        const adminExists = yield User_1.default.exists({ role: 'admin' });
        let userRole = 'user';
        if (!adminExists) {
            userRole = 'admin';
        }
        const user = yield User_1.default.create({
            firstname,
            lastname,
            email,
            password,
            role: userRole,
        });
        const token = (0, generateToken_1.createToken)(user._id);
        res.status(201).json({ token, data: user });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ email: req.body.email });
        if (!user || !(yield bcrypt_1.default.compare(req.body.password, user.password))) {
            return res.status(401).json({ error: 'Invalid Password or Email' });
        }
        const token = (0, generateToken_1.createToken)(user._id);
        delete user._doc.password;
        res.status(200).json({ token, data: user });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.login = login;
