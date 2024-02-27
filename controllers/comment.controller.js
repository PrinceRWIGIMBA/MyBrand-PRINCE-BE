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
exports.deleteComment = exports.allComments = exports.getComment = exports.updateComment = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../model/Comment"));
const Blog_1 = __importDefault(require("../model/Blog"));
const User_1 = __importDefault(require("../model/User"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        // Extract blogId from URL params
        const { blogId } = req.params;
        // Check if blogId is provided
        if (!blogId) {
            return res.status(400).json({ error: 'Blog ID is required' });
        }
        const comment = yield Comment_1.default.create(Object.assign({ user: userId, blog: blogId }, req.body));
        // Update the blog with the new comment
        yield Blog_1.default.findByIdAndUpdate(blogId, {
            $addToSet: { comments: comment._id },
        }, { new: true });
        // Update the user with the new comment
        yield User_1.default.findByIdAndUpdate(userId, {
            $addToSet: { comments: comment._id },
        }, { new: true });
        res.status(201).json({ data: comment });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.createComment = createComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedComment = yield Comment_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedComment) {
            return res.status(404).json({ error: `No comment found for id ${id}` });
        }
        res.status(200).json({ data: updatedComment, });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.updateComment = updateComment;
const getComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const comment = yield Comment_1.default.findById(id);
        if (!comment) {
            return res.status(404).json({ error: `No comment found for id ${id}` });
        }
        res.status(200).json({ data: comment });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.getComment = getComment;
const allComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield Comment_1.default.find();
        res.status(200).json({ data: comments });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.allComments = allComments;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { id } = req.params;
        const deletedComment = yield Comment_1.default.findByIdAndDelete(id);
        if (!deletedComment) {
            return res.status(404).json({ error: `No comment found for id ${id}` });
        }
        // Remove the comment ID from the blog's comments array
        yield Blog_1.default.findByIdAndUpdate(req.blog._id, {
            $pull: { comments: deletedComment._id },
        }, { new: true });
        console.log(req.blog._id);
        // Remove the comment ID from the user's comments array
        yield User_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b._id, {
            $pull: { comments: deletedComment._id },
        }, { new: true });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.deleteComment = deleteComment;
