import { Router } from "express";
import { refreshTokenController } from "../controllers/refreshController";

const refreshRouter = Router();

refreshRouter.route("/").post(refreshTokenController);

export default refreshRouter;
