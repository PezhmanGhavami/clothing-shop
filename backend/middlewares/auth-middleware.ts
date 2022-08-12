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
    //TODO - make this async and catch the expiration
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    //Get user from token
    prisma.user
      .findFirst({
        where: {
          id: (decoded as IToken).id,
          NOT: {
            expiredJWTs: {
              has: token,
            },
          },
          // OR: [
          //   {
          //     expiredJWTs: { isEmpty: true },
          //   },
          // ],
        },
      })
      .then((user) => {
        if (user) {
          res.locals.user = user;
          res.locals.token = token;
          next();
        } else {
          throw new Error("No user matched.");
        }
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
