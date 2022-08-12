import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../utils/prisma-client";
import { IToken } from "../middlewares/auth-middleware";
import { IExpressEndpointHandler } from "../utils/types";

function generateToken(id: string) {
  if (process.env.JWT_SECRET) {
    const payload: IToken = { id };
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  }
  throw new Error("Couldn't generate token.");
}

/**
 * @desc   Register a new user
 * @route  POST /api/users
 * @access Public
 * */
const registerUser: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
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
        name: user.displayName,
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
const loginUser: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
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
        return prisma.user.update({
          data: {
            activeJWTs: {
              push: generateToken(user.id),
            },
          },
          where: {
            id: user.id,
          },
        });
      }
      res.status(401);
      throw new Error("Wrong email or password.");
    })
    .then((user) => {
      return res.status(202).json({
        id: user.id,
        name: user.displayName,
        email: user.email,
        token: user.activeJWTs[user.activeJWTs.length - 1],
      });
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
 * @desc   Logs out a user
 * @route  POST /api/users/logout
 * @access Public
 * */
const logoutUser: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const newActiveJWTs = res.locals.user.activeJWTs.filter(
    (token: string) => token !== res.locals.token
  );

  prisma.user
    .update({
      data: {
        activeJWTs: newActiveJWTs,
        expiredJWTs: {
          push: res.locals.token,
        },
      },
      where: { id: res.locals.user.id },
    })
    .then(() => {
      return res.status(202).json({
        message: "User logged out.",
      });
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
 * @desc   Logs out a user from all their devices except the one doing this
 * @route  POST /api/users/logout
 * @access Public
 * */
const logoutUserFromEverywhere: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const newExpiredJWTs = res.locals.user.activeJWTs.filter(
    (token: string) => token !== res.locals.token
  );
  prisma.user
    .update({
      data: {
        activeJWTs: [res.locals.token],
        expiredJWTs: {
          push: newExpiredJWTs,
        },
      },
      where: { id: res.locals.user.id },
    })
    .then(() => {
      return res.status(202).json({
        message: "User logged out from all devices.",
      });
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
const getUser: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const user = {
    id: res.locals.user.id,
    name: res.locals.user.displayName,
    email: res.locals.user.email,
  };

  res.status(200).json(user);
};

export {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  logoutUserFromEverywhere,
};
