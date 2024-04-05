import { Request, Response } from "express";
import * as sessionServices from "../services/sessionService";

export const createSession = async (req: Request, res: Response) => {
  const data = req.body;
  const created_at = new Date();
  const sessionData = { ...data, created_at };
  try {
    const result = await sessionServices.createSession(sessionData);
    res.json({
      success: true,
      message: "Session created successfully",
      data: result,
    });
  } catch (error: any) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getSession = async (req: Request, res: Response) => {
  const session_code = req.params.id;
  try {
    const result = await sessionServices.getSession(session_code);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No session found",
      });
    }
    return res.json({
      success: true,
      message: "Session details fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

interface deleteRequest extends Request {
  userId?: number;
}
export const deleteSession = async (req: deleteRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new Error("User ID is not found");
  }
  const session_code = req.params.id;
  try {
    const sessionDeleted = await sessionServices.deleteSession(
      session_code,
      userId
    );
    if (sessionDeleted) {
      res.json({
        success: true,
        message: "Session deleted successfully!!",
      });
    } else {
      throw new Error("Session not found");
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
