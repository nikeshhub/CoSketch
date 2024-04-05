import { User } from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { getRepository } from "typeorm";
import { RefreshToken } from "../models/refreshToken";

dotenv.config();
const refreshTokenTime = "30000000";
const secretKey = process.env.JWT_SECRET_KEY || "CoSketch";
console.log("time", Number(refreshTokenTime));

export const createRefreshToken = async (
  refreshToken: string,
  user: number
) => {
  const expiryDateMillis = Date.now() + Number(refreshTokenTime) * 1000;
  console.log(Date.now());
  const expiryDate = new Date(expiryDateMillis);

  if (isNaN(expiryDate.getTime())) {
    throw new Error("Invalid expiry date");
  }

  const refreshTokenRepository = getRepository(RefreshToken);
  let response = await refreshTokenRepository.create({
    token: refreshToken,
    userId: user,
    expiryDate: expiryDate,
  });
  await refreshTokenRepository.save(response);

  return response.token;
};

export const verifyExpiration = (refreshToken: RefreshToken) => {
  return refreshToken.expiryDate.getTime() < new Date().getTime();
};
