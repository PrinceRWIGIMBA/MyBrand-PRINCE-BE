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
exports.deleteMessage = exports.getMessage = exports.allMessages = exports.updateMessage = exports.createMessage = void 0;
const Message_1 = __importDefault(require("../model/Message"));
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield Message_1.default.create(req.body);
        res.status(200).json({ data: message });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createMessage = createMessage;
const updateMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const message = yield Message_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!message) {
            return res.status(404).json({ error: `No message for this id ${id}` });
        }
        res.status(200).json({ data: message });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateMessage = updateMessage;
const allMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Message_1.default.find();
        res.status(200).json({ size: messages.length, data: messages });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.allMessages = allMessages;
const getMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield Message_1.default.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ error: `No Message for this id ${req.params.id}` });
        }
        res.status(200).json(message);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getMessage = getMessage;
const deleteMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const message = yield Message_1.default.findById(id);
        if (!message) {
            return res.status(404).json({ error: `No Message for this id ${id}` });
        }
        yield Message_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "delete successfully made" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteMessage = deleteMessage;
