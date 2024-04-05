import { Router } from "express";
import * as sessionController from "../controllers/sessionController";
import isAuthorizedToDelete from "../middlewares/isAuthorized";
import isAuthenticated from "../middlewares/isAuthenticated";

const sessionRouter = Router();

sessionRouter
  .route("/")
  .post(sessionController.createSession)
  .get(sessionController.getSession);

sessionRouter
  .route("/:id")
  .get(sessionController.getSession)
  .delete(
    isAuthenticated,
    // isAuthorizedToDelete,
    sessionController.deleteSession
  );

export default sessionRouter;
