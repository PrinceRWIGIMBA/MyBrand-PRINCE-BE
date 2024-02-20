import mongoose, { Schema, Document, Model } from "mongoose";

interface IComment extends Document {
  user: object;
  blog: mongoose.Types.ObjectId;
  description: string;
}

const commentSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User is required"],
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Blog is required"],
    },
    description: {
      type: String,
      required: [true, "Comment description is required"],
    },
  },
  { timestamps: true }
);

const Comment: Model<IComment> = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
