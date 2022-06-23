require("dotenv").config();
const express = require("express");

const usersRouter = require("./routes/users-routes");
const {
  errorHandler,
} = require("./middlewares/error-middleware");

const prisma = require("./utils/prisma-client");

const app = express();
const HOST = "127.0.0.1";
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("home");
});

app.use("/api/users", usersRouter);

app.use("*", (req, res) => {
  res.status(404).send("Not Found");
});

app.use(errorHandler);

app.listen(PORT, HOST, (error) => {
  if (error) {
    return console.error(error);
  }
  console.log(`Server started at http://${HOST}:${PORT}`);
});
