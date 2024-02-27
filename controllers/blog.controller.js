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
exports.dislikeBlog = exports.likeBlog = exports.deleteBlog = exports.getBlog = exports.allBlogs = exports.updateBlog = exports.createBlog = void 0;
const multer_1 = require("../config/multer");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const Blog_1 = __importDefault(require("../model/Blog"));
const User_1 = __importDefault(require("../model/User"));
// Function to create a new blog
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use Multer middleware for file upload
        (0, multer_1.upload)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                // Handle multer errors
                return res.status(400).json({ error: err.message });
            }
            try {
                // Check if req.files exists
                if (!req.files || !req.files.length) {
                    return res.status(400).json({ error: 'At least one image file is required' });
                }
                // Upload the first image to Cloudinary
                const cloudinaryResponse = yield cloudinary_1.default.uploader.upload(req.files[0].path);
                const imageUrl = cloudinaryResponse.secure_url;
                const cloudinary_id = cloudinaryResponse.public_id;
                // Create blog entry with the first image's URL and cloudinary_id
                const newBlogData = Object.assign(Object.assign({}, req.body), { author: req.user._id, image: imageUrl, cloudinary_id: cloudinary_id, likes: [], disLikes: [] });
                const blog = yield Blog_1.default.create(newBlogData);
                // Update user's blogs
                yield User_1.default.findByIdAndUpdate(req.user._id, { $addToSet: { blogs: blog._id } }, { new: true });
                res.status(201).send({ data: blog });
            }
            catch (error) {
                res.status(500).send({ error: error.message });
            }
        }));
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.createBlog = createBlog;
// Function to update a blog
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let blog = yield Blog_1.default.findById(id);
        if (!blog) {
            return res.status(404).send({ error: `No Blog for this id ${id}` });
        }
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: `You are not allowed to update this blog` });
        }
        // Check if a new image is uploaded
        if (req.file) {
            // Upload new image to Cloudinary
            const cloudinaryResponse = yield cloudinary_1.default.uploader.upload(req.file.path);
            const newImageUrl = cloudinaryResponse.secure_url;
            // Delete old image from Cloudinary if there was one
            if (blog.cloudinary_id) {
                yield cloudinary_1.default.uploader.destroy(blog.cloudinary_id);
            }
            // Update image URL and Cloudinary ID in the blog object
            blog.image = newImageUrl;
            blog.cloudinary_id = cloudinaryResponse.public_id;
        }
        // Update other fields of the blog if they are present in the request body
        if (req.body.title) {
            blog.title = req.body.title;
            console.log(req.body.title);
        }
        if (req.body.description) {
            blog.description = req.body.description;
        }
        if (req.body.contents) {
            blog.contents = req.body.contents;
        }
        // Add more fields as needed
        // Save the updated blog to the database
        blog = yield blog.save();
        res.status(200).json({ data: blog });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.updateBlog = updateBlog;
const allBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield Blog_1.default.find().populate('author');
        res.status(200).json({ size: blogs.length, data: blogs });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.allBlogs = allBlogs;
const getBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield Blog_1.default.findById(req.params.id).populate('author');
        if (!blog) {
            return res.status(404).send({ error: `No blog for this id ${req.params.id}` });
        }
        res.send(blog);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.getBlog = getBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blog = yield Blog_1.default.findById(id);
        if (!blog) {
            return res.status(404).send({ error: `No Blog for this id ${id}` });
        }
        yield cloudinary_1.default.uploader.destroy(blog.cloudinary_id);
        yield blog.remove();
        res.status(200).json({ message: "Delete successful" });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.deleteBlog = deleteBlog;
const likeBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const blog = yield Blog_1.default.findById(id);
        if (!blog) {
            return res.status(404).json({ error: `No Blog found for id ${id}` });
        }
        if (blog.likes.includes(req.user._id)) {
            return res.status(400).json({ error: "You have already liked this blog" });
        }
        if (blog.disLikes.includes(req.user._id)) {
            blog.disLikes = blog.disLikes.filter((userId) => userId.toString() !== req.user._id.toString());
        }
        blog.likes.push(req.user._id);
        yield blog.save();
        return res.status(200).json({ message: 'Blog liked successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.likeBlog = likeBlog;
const dislikeBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const blog = yield Blog_1.default.findById(id);
        if (!blog) {
            return res.status(404).json({ error: `No Blog found for id ${id}` });
        }
        if (blog.disLikes.includes(req.user._id)) {
            return res.status(400).json({ error: "You have already disliked this blog" });
        }
        if (blog.likes.includes(req.user._id)) {
            blog.likes = blog.likes.filter((userId) => userId.toString() !== req.user._id.toString());
        }
        blog.disLikes.push(req.user._id);
        yield blog.save();
        return res.status(200).json({ message: 'Blog disliked successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.dislikeBlog = dislikeBlog;
