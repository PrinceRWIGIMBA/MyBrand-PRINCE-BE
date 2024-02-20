import { Request, Response, NextFunction } from 'express';
import Blog from '../model/Blog';
import User from '../model/User';


interface AuthenticatedRequest extends Request {
  user: { _id: string }; 
}


export const createBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
 
    req.body.author = req.user._id;
    const blog = await Blog.create(req.body);


    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { blogs: blog._id } },
      { new: true }
    );

    res.status(201).send({ data: blog });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};


export const updateBlog = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).send({ error: `No Blog for this id ${id}` });
    }

    // Check if The Blog Belongs To User
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: `You are not allowed to update this blog` });
    }

    const doc = await Blog.findOneAndUpdate(blog._id, req.body, { new: true });

    res.status(200).json({ data: doc });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

// Get List of Blogs
export const allBlogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const blogs = await Blog.find().populate('author');
    res.status(200).json({ size: blogs.length, data: blogs });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

// Get a single blog
export const getBlog = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

// Delete Blog
export const deleteBlog = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send({ error: `No Blog for this id ${id}` });
    }
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "delete successfully made " });

  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};
