import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

export const createToken = (id: any): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
};
