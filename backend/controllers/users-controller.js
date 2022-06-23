const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../utils/prisma-client");

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

/**
 * @desc   Register a new user
 * @route  POST /api/users
 * @access Public
 * */
const registerUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All feilds are required.");
  }

  prisma.user
    .findUnique({ where: { email } })
    .then((userExists) => {
      if (userExists) {
        res.status(400);
        throw new Error("User already exists.");
      }
    })
    .then(() => bcrypt.genSalt(10))
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return prisma.user.create({
        data: {
          displayName: name,
          email,
          password: hashedPassword,
        },
      });
    })
    .then((user) => {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    })
    .catch((error) => {
      if (res.statusCode) {
        return next(error);
      }
      console.log(error);
      res.status(500);
      return next(new Error("Couldn't save to DB."));
    });
};

/**
 * @desc   Logins a user
 * @route  POST /api/users/login
 * @access Public
 * */
const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All feilds are required.");
  }

  prisma.user
    .findUnique({ where: { email } })
    .then((user) => {
      if (user) {
        return Promise.all([
          bcrypt.compare(password, user.password),
          user,
        ]);
      }
      res.status(401);
      throw new Error("Wrong email or password.");
    })
    .then(([passwordIsCorrect, user]) => {
      if (passwordIsCorrect) {
        return res.status(202).json({
          id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user.id),
        });
      }
      res.status(401);
      throw new Error("Wrong email or password.");
    })
    .catch((error) => {
      if (res.statusCode) {
        return next(error);
      }
      console.log(error);
      res.status(500);
      return next(new Error("Something went wrong."));
    });
};

/**
 * @desc   Gets a user
 * @route  GET /api/users/:id
 * @access Private
 * */
const getUser = (req, res, next) => {
  const user = {
    id: req.user.id,
    name: req.user.displayName,
    email: req.user.email,
  };

  res.status(200).json(user);
};

module.exports = { getUser, loginUser, registerUser };
