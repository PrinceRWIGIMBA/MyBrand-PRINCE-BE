import mongoose, { Schema, Document, Model } from "mongoose";

interface IBlog extends Document {
  title: string;
  description: string;
  image?: string;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  disLikes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
}

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "blog description is required"],
      trim: true,
    },
    image: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog: Model<IBlog> = mongoose.model<IBlog>("Blog", BlogSchema);
export default Blog;
