import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/generateToken';
import User from '../model/User';




// Function to get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password'); // Exclude the password field
    res.status(200).json({ data: users });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

// Function to log out (assuming you are using token-based authentication)
export const logout = async (req: Request, res: Response, next: NextFunction) => {

  res.status(200).json({ message: 'Logged out successfully' });
};

export const signup = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    
    const adminExists = await User.exists({ role: 'admin' });

    let userRole = 'user';
    if (!adminExists) {
      
      userRole = 'admin';
    }

    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      role: userRole, 
    });

    const token = createToken(user._id);

    res.status(200).json({ token, data: user });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
   
    const user = await User.findOne({ email: req.body.email });

    
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ error: 'Invalid Password or Email' });
    }

   
    const token = createToken(user._id);

  
    delete user._doc.password;

   
    res.status(200).json({ token, data: user });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};
