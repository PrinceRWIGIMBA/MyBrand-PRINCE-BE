import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  firstname: string;
  lastname: string;
  image?: string;
  email: string;
  password: string;
  role: "user" | "admin";
  blogs: ["_id"][];
  comments: Schema.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is Required"],
    },

    lastname: {
      type: String,
      required: [true, "Last Name is Required"],
    },

    image: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is Required"],
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
