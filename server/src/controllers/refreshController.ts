import { Request, Response } from "express";
import { refreshTokenService } from "../services/refreshService";

export const refreshTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    const result = await refreshTokenService(refreshToken);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
        accessToken: result.accessToken,
      });
    } else {
      res.status(401).json({ success: false, message: result.message });
    }
  } catch (error: any) {
    console.error("Error refreshing access token:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
