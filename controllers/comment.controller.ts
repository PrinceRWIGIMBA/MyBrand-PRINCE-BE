import { Request, Response } from 'express';
import Comment from '../model/Comment';
import Blog from '../model/Blog';
import User from '../model/User';

interface AuthenticatedRequest extends Request {
  blog: { _id: string };
  user: { _id: string };
}




export const createComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let userId = req.user?._id;
    
    // Extract blogId from URL params
    const { blogId } = req.params;

    // Check if blogId is provided
    if (!blogId) {
      return res.status(400).json({ error: 'Blog ID is required' });
    }

    const comment = await Comment.create({ user: userId, blog: blogId, ...req.body });

    // Update the blog with the new comment
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $addToSet: { comments: comment._id },
      },
      { new: true }
    );

    // Update the user with the new comment
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { comments: comment._id },
      },
      { new: true }
    );

    res.status(201).json({ data: comment });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedComment) {
      return res.status(404).json({ error: `No comment found for id ${id}` });
    }

    res.json({ data: updatedComment });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export const getComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ error: `No comment found for id ${id}` });
    }

    res.json({ data: comment });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export const allComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find();
    res.json({ data: comments });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ error: `No comment found for id ${id}` });
    }

    // Remove the comment ID from the blog's comments array
    await Blog.findByIdAndUpdate(
      req.blog._id,
      {
        $pull: { comments: deletedComment._id },
      },
      { new: true }
    );
    console.log(req.blog._id);

    // Remove the comment ID from the user's comments array
    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $pull: { comments: deletedComment._id },
      },
      { new: true }
    );

    res.status(204).send();
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};
