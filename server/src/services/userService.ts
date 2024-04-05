import { Request, Response } from "express";
import { IUser } from "../interfaces/user";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/verificationEmail";
import { FindOneOptions, getRepository } from "typeorm";
import { createRefreshToken } from "../utils/refreshToken";

dotenv.config();
const secretKey = process.env.SECRET_KEY as string;

export const userSignUp = async (userData: IUser) => {
  const { name, email, password, isVerified } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const userRepository = getRepository(User);
  const options: FindOneOptions<User> = { where: { email } };
  const existingUser = await userRepository.findOne(options);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const newUser = userRepository.create({
    name,
    email,
    password: hashedPassword,
    isVerified: false,
  });

  const result = await userRepository.save(newUser);

  const infoObj = { _id: result.id };
  const expiryInfo = { expiresIn: "2d" };
  const verificationToken = jwt.sign(infoObj, secretKey, expiryInfo);
  await sendVerificationEmail(email, verificationToken);
  return result;
};

export const verifyUser = async (bearerToken: string) => {
  const userRepository = getRepository(User);

  if (!bearerToken) throw new Error("Token not found");

  const token = bearerToken.split(" ")[1];
  const infoObj: any = jwt.verify(token, secretKey);
  const userId = infoObj._id;

  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) throw new Error("User not found");

  user.isVerified = true;
  const result = await userRepository.save(user);

  return result;
};

export const userSignIn = async (email: string, password: string) => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({
    where: { email: String(email) },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isVerified) {
    throw new Error("Email not verified");
  }

  const isPasswordValidated: boolean = await (bcrypt.compare(
    password,
    user.password
  ) as Promise<boolean>);

  if (!isPasswordValidated) {
    throw new Error("Invalid password");
  }

  const infoObj = { _id: user.id };
  const accessExpiryInfo = { expiresIn: "1d" };
  const refreshExpiryInfo = { expiresIn: "365d" };
  const accessToken = jwt.sign(infoObj, secretKey, accessExpiryInfo);
  const refreshToken = jwt.sign(infoObj, secretKey, refreshExpiryInfo);
  createRefreshToken(refreshToken, user.id);

  const userWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const getAllUsers = async () => {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.find();

    return { success: true, users };
  } catch (error: any) {
    console.error("Error in getAllUsersService:", error);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
};
