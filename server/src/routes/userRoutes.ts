import { Router } from "express";
import * as userController from "../controllers/userController";
import isAuthenticated from "../middlewares/isAuthenticated";

const userRouter = Router();

userRouter.route("/sign-up").post(userController.userSignUp);
userRouter.route("/verify").post(userController.verifyUser);
userRouter.route("/sign-in").post(userController.userSignIn);
userRouter.route("/").get(isAuthenticated, userController.getAllUsers);

export default userRouter;
