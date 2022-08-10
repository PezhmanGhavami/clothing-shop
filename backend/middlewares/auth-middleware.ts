import jwt from "jsonwebtoken";

import prisma from "../utils/prisma-client";
import { IExpressEndpointHandler } from "../utils/types";

export interface IToken {
  id: string;
}

const protect: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  if (
    process.env.JWT_SECRET &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //Get token from header
    const token = req.headers.authorization.split(" ")[1];
    //Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    //Get user from token
    prisma.user
      .findUnique({
        where: {
          id: (decoded as IToken).id,
        },
      })
      .then((user) => {
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(error);
        res.status(401);
        next(new Error("Not authorized"));
      });
  } else {
    res.status(401);
    next(new Error("Not authorized"));
  }
};

export default protect;
