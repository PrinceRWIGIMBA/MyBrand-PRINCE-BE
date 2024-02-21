import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../model/User';

interface AuthenticatedRequest extends Request {
  user?: { _id: string; role: string }; 
  blog?: { _id: string };
}

export const requireSignIn = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'You are not logged in. Please log in to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    if (decoded) {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'The user belonging to this token no longer exists' });
      }

      req.user = { _id: String(user._id), role: String(user.role) };
      next();
    }
  } catch (error: any) {
    if(error.message === 'jwt malformed') {
      return res.status(500).json({ error: "Please login first" });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const allowedTo = (...roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.role || !roles.includes(req.user.role)) { 
    return res.status(403).json({ error: 'You are not allowed to access this route' });
  }
  next();
};

export const isAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => { };
