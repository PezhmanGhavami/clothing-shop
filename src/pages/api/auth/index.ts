import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcryptjs";

import { sessionOptions } from "../../../utils/session";
import { prisma } from "../../../utils/prisma-client";

import { IApiError } from "./login";
export interface IUser {
  isLoggedIn: boolean;
}

export default withIronSessionApiRoute(
  userRoute,
  sessionOptions
);

async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse<IUser | IApiError>
) {
  if (req.method === "GET") {
    const user = req.session.user;
    if (user) {
      if (
        Date.now() - user.dateCreated >
        1000 * 60 * 60 * 24
      ) {
        const newUser = {
          ...user,
          dateCreated: Date.now(),
        };
        req.session.user = newUser;
        await req.session.save();
      }
      return res.json({
        isLoggedIn: true,
      });
    }
    return res.json({
      isLoggedIn: false,
    });
  } else if (req.method === "POST") {
    try {
      const {
        email,
        password,
        displayName,
        confirmPassword,
      } = await req.body;

      if (
        !email ||
        !password ||
        !displayName ||
        !confirmPassword
      ) {
        res.status(400);
        throw new Error("All fields are required.");
      }

      if (password !== confirmPassword) {
        res.status(400);
        throw new Error("Passwords should match.");
      }

      const userExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (userExists) {
        res.status(401);
        throw new Error("User already exists.");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        password,
        salt
      );

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          displayName,
          cart: {
            create: {
              items: "[]",
              count: 0,
              total: 0.0,
              discountedTotal: 0.0,
            },
          },
        },
        include: { cart: true },
      });

      const user = {
        userID: newUser.id,
        dateCreated: Date.now(),
      };
      req.session.user = user;
      if (newUser.cart) {
        req.session.cart = {
          ...newUser.cart,
          items: [],
        };
      }
      await req.session.save();

      return res.json({ isLoggedIn: true });
    } catch (error) {
      return res.json({
        status: "ERROR",
        message: (error as Error).message,
      });
    }
  }
  return res
    .status(400)
    .json({ status: "ERROR", message: "Bad Request." });
}
