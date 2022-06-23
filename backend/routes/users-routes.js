const express = require("express");

const usersController = require("../controllers/users-controller");
const protect = require("../middlewares/auth-middleware");

const usersRouter = express.Router();


usersRouter.post("/", usersController.registerUser);

usersRouter.get("/me", protect, usersController.getUser);

usersRouter.post("/login", usersController.loginUser);

module.exports = usersRouter;
