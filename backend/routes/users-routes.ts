import express from "express";

import * as usersController from "../controllers/users-controller";
import protect from "../middlewares/auth-middleware";

const usersRouter = express.Router();

usersRouter.post("/", usersController.registerUser);

usersRouter.get("/me", protect, usersController.getUser);

usersRouter.post("/login", usersController.loginUser);

export default usersRouter;
