import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Session } from "../models/session";

interface AuthorizedRequest extends Request {
  userId?: number;
}

const isAuthorizedToDelete = async (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Ensure req.userId is set properly
    if (!req.userId) {
      throw new Error("User ID not found in request");
    }

    const userId = req.userId;
    const sessionRepository = getRepository(Session);
    const session = await sessionRepository.findOne({
      where: { created_by: userId },
    });

    if (!session) {
      throw new Error(
        "You have not created this session, ask the creator to delete the session"
      );
    }

    // User is authorized, call the next middleware or route handler
    next();
  } catch (error: any) {
    // Proper error handling
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export default isAuthorizedToDelete;
