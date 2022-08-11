import dotenv from "dotenv";
dotenv.config();
import express from "express";

import usersRouter from "./routes/users-routes";
import categoriesRouter from "./routes/categories-routes";

import errorHandler from "./middlewares/error-middleware";

const app = express();
const HOST = "127.0.0.1";
const envPort = process.env.PORT;
const PORT = envPort ? parseInt(envPort) : 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("home");
});

app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);

app.use("*", (req, res) => {
  res.status(404).send("Not Found");
});

app.use(errorHandler);

app
  .listen(PORT, HOST, () => {
    console.log(`Server started at http://${HOST}:${PORT}`);
  })
  .on("error", (err) => {
    return console.error(err + "\n\n" + err.message);
  });
