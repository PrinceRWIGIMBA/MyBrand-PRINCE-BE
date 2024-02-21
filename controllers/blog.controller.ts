import { Request, Response } from 'express';
import { singleUpload } from '../config/multer'; // Importing the singleUpload middleware from your multer configuration file
import cloudinary from '../config/cloudinary';
import Blog from '../model/Blog'; // Import Blog model
import User from '../model/User'; // Import User model
import mongoose, { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user: { _id: Types.ObjectId };   
}

// Function to create a new blog
export const createBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Use Multer middleware for file upload
    singleUpload(req, res, async (err: any) => {
      if (err) {
        // Handle multer errors
        return res.status(400).json({ error: err.message });
      }

      // Check if req.file exists
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      // Upload image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
      const imageUrl = cloudinaryResponse.secure_url;
      const cloudinary_id = cloudinaryResponse.public_id;

      // Create blog entry
      const newBlogData = {
        ...req.body,
        author: req.user._id,
        image: imageUrl, // Assuming you have an 'image' field in your blog model
        cloudinary_id: cloudinary_id,
        likes: [], 
      disLikes: [],
      };
      const blog = await Blog.create(newBlogData);

      // Update user's blogs
      await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { blogs: blog._id } },
        { new: true }
      );

      res.status(201).send({ data: blog });
    });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

// Function to update a blog
export const updateBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    let blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).send({ error: `No Blog for this id ${id}` });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: `You are not allowed to update this blog` });
    }

    // Check if a new image is uploaded
    if (req.file) {
      // Upload new image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
      const newImageUrl = cloudinaryResponse.secure_url;
    
      // Delete old image from Cloudinary if there was one
      if (blog.cloudinary_id) {
        
        await cloudinary.uploader.destroy(blog.cloudinary_id);
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
    blog = await blog.save();

    res.status(200).json({ data: blog });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};


export const allBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().populate('author');
    res.status(200).json({ size: blogs.length, data: blogs });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export const getBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author');

    if (!blog) {
      return res.status(404).send({ error: `No blog for this id ${req.params.id}` });
    }
    res.send(blog);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};


export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send({ error: `No Blog for this id ${id}` });
    }

   
    await cloudinary.uploader.destroy(blog.cloudinary_id);

  
    await blog.remove();

    res.status(200).json({ message: "Delete successful" });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};





export const likeBlog = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);

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
    await blog.save();

    return res.status(200).json({ message: 'Blog liked successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};





export const dislikeBlog = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);

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
    await blog.save();

    return res.status(200).json({ message: 'Blog disliked successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};


