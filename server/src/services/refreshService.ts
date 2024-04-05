import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../models/user";

const secretKey = process.env.JWT_SECRET || "CoSketch";

export interface RefreshTokenResult {
  success: boolean;
  message?: string;
  accessToken?: string;
}

export const refreshTokenService = async (
  refreshToken: string
): Promise<RefreshTokenResult> => {
  try {
    const userRepository = getRepository(User);
    const payload = jwt.verify(refreshToken, secretKey);
    const userId = (payload as any)._id;
    console.log("userId", userId);

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const infoObj = { _id: user.id };
    const expiryInfo = { expiresIn: "1m" };
    const accessToken = jwt.sign(infoObj, secretKey, expiryInfo);

    return { success: true, accessToken };
  } catch (error: any) {
    console.error("Error in refreshTokenService:", error);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
};
