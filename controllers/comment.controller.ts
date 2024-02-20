import { Request, Response } from 'express';
import Comment from '../model/Comment';
import Blog from '../model/Blog';
import User from '../model/User';

interface AuthenticatedRequest extends Request {
  blog: { _id: string };
  user: { _id: string };
}


// Create Comment
export const createComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let userId = req.user?._id;
    const comment = await Comment.create({ user: userId, ...req.body });

    // Add comment to blog
    await Blog.findByIdAndUpdate(
      req.body.blog,
      {
        $addToSet: { comments: comment._id },
      },
      { new: true }
    );

    // Add comment to user
    await User.findByIdAndUpdate(
      req.user._id,
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

// Update Comment
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

// Get a Single Comment
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

// Get All Comments
export const allComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find();
    res.json({ data: comments });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

// Delete Comment
export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ error: `No comment found for id ${id}` });
    }

    // Remove comment from associated blog
    await Blog.findByIdAndUpdate(
      req.blog._id,
      {
        $pull: { comments: deletedComment._id },
      },
      { new: true }
    );

    // Remove comment from associated user
    await User.findByIdAndUpdate(
      req.user._id,
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
