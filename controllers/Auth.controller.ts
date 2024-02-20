import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/generateToken';
import User from '../model/User';

// Sign Up a new user
export const signup = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Create the user
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
    });

    // Generate token for the user
    const token = createToken(user._id);

    // Respond with token and user data
    res.status(201).json({ token, data: user });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });

    // If user not found or password is incorrect, return error
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ error: 'Invalid Password or Email' });
    }

    // Generate token for the user
    const token = createToken(user._id);

    // Delete sensitive data from user object
    delete user._doc.password;

    // Respond with token and user data
    res.status(200).json({ token, data: user });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};
