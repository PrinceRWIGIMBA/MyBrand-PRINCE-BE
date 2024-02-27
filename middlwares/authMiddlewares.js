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
exports.isAuth = exports.allowedTo = exports.requireSignIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../model/User"));
const requireSignIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ error: 'You are not logged in. Please log in to access this route' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded Token:', decoded.id);
        if (decoded) {
            //console.log('Found User:', decoded.id);
            const user = yield User_1.default.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ error: 'The user belonging to this token no longer exists' });
            }
            req.user = { _id: String(user._id), role: String(user.role) };
            next();
        }
    }
    catch (error) {
        if (error.message === 'jwt malformed') {
            return res.status(500).json({ error: "Please login first" });
        }
        return res.status(500).json({ error: error.message });
    }
});
exports.requireSignIn = requireSignIn;
const allowedTo = (...roles) => (req, res, next) => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'You are not allowed to access this route' });
    }
    next();
};
exports.allowedTo = allowedTo;
const isAuth = (req, res, next) => { };
exports.isAuth = isAuth;
