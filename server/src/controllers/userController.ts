import { Request, Response } from "express";
import * as userServices from "../services/userService";
import { getRepository } from "typeorm";
import { User } from "../models/user";

export const userSignUp = async (req: Request, res: Response) => {
  const userData = req.body;
  try {
    const result = await userServices.userSignUp(userData);
    res.status(201).json({
      success: true,
      message:
        "Verification email has been sent to your email. Please verify your email to continue.",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const bearerToken = req.headers.authorization;
    console.log(bearerToken);
    const user = await userServices.verifyUser(bearerToken as string);
    if (!user) {
      res.json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Email verified successfully",
      data: user,
    });
  } catch (error: any) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const userSignIn = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // const loginData = { email, password };

    const result = await userServices.userSignIn(email, password);
    console.log(result);

    res
      .cookie("refreshToken", result.refreshToken, {
        expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
      })
      .cookie("accessToken", result.accessToken, { httpOnly: true })
      .status(201)
      .json({
        success: true,
        message: "Login successful",
        data: result.user,
        accessToken: result.accessToken,
      });
  } catch (error: any) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await userServices.getAllUsers();

    if (result.success) {
      res.status(200).json({ success: true, users: result.users });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error: any) {
    console.error("Error getting all users:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
