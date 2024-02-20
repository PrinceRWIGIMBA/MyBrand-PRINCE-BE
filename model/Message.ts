import mongoose, { Schema, Document, Model } from "mongoose";


interface IMessage extends Document {
  username: string;
  email: string;
  querie: string;
}

const MessageSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username Name is Required"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is Required"],
    },
    querie: {
        type: String,
        required: [true, "Your message  is required"],
        trim: true,
      } 
  },

  { toJSON: { virtuals: true }, timestamps: true }
);

MessageSchema.pre<IMessage>("save", async function (next) {
  next();
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
