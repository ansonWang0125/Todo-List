import db from "../Model";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const User = db.users;

interface User {
    userName: string;
    password: string;
    id: number;
}

interface AuthenticatedRequest extends Request {
    token?: string;
    user?: User;
}

const checkUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || '';
    console.log("token", token);
    const decoded: any = jwt.verify(token, process.env.secretKey || '');
    const user = await User.findOne({
      where: {
        id: decoded.id,
      },
    });
    if (user !== null) {
      console.log('find');
    } else {
      throw new Error();
    }
    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    console.log('checkUser error');
    console.log(error);
    res.status(400).send({ error: 'Please authenticate.' });
  }
};

export {
  checkUser
};
