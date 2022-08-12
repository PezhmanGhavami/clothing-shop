import express from "express";

import * as usersController from "../controllers/users-controller";
import protect from "../middlewares/auth-middleware";

const usersRouter = express.Router();

usersRouter.post("/", usersController.registerUser);
usersRouter.get("/me", protect, usersController.getUser);
usersRouter.post("/login", usersController.loginUser);
usersRouter.post(
  "/logout",
  protect,
  usersController.logoutUser
);
usersRouter.post(
  "/logout-all",
  protect,
  usersController.logoutUserFromEverywhere
);

export default usersRouter;
