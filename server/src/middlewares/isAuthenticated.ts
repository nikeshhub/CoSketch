import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET_KEY || "CoSketch";

interface AuthenticatedRequest extends Request {
  userId?: number;
}

const isAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) throw new Error("Token not found");
    const token = bearerToken.split(" ")[1];

    const infoObj: any = jwt.verify(token, secretKey);
    req.userId = infoObj._id;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export default isAuthenticated;
