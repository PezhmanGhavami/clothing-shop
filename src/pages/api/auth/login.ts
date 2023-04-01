import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcryptjs";

import { sessionOptions } from "../../../utils/session";
import { prisma } from "../../../utils/prisma-client";

import type { IUser } from "./index";

export default withIronSessionApiRoute(
  loginRoute,
  sessionOptions,
);

export interface IApiMessage {
  status: "ERROR" | "SUCCESS";
  message: string;
}

async function loginRoute(
  req: NextApiRequest,
  res: NextApiResponse<IUser | IApiMessage>,
) {
  if (req.method === "POST") {
    try {
      const { email, password } = await req.body;

      if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required.");
      }

      const lowerCaseEmail = (
        email as string
      ).toLowerCase();

      const userExists = await prisma.user.findUnique({
        where: {
          email: lowerCaseEmail,
        },
        include: {
          cart: true,
        },
      });
      if (!userExists) {
        res.status(401);
        throw new Error("Wrong email or password");
      }

      const passwordIsCorrect = await bcrypt.compare(
        password,
        userExists.password,
      );
      if (!passwordIsCorrect) {
        res.status(401);
        throw new Error("Wrong email or password");
      }
      const user = {
        userID: userExists.id,
        dateCreated: Date.now(),
      };
      req.session.user = user;
      if (userExists.cart) {
        const cartItems = JSON.parse(userExists.cart.items);
        req.session.cart = {
          ...userExists.cart,
          items: cartItems,
        };
      } else {
        const updatedUser = await prisma.user.update({
          where: {
            id: userExists.id,
          },
          data: {
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
        if (updatedUser.cart) {
          req.session.cart = {
            ...updatedUser.cart,
            items: [],
          };
        }
      }
      await req.session.save();

      return res.json({
        isLoggedIn: true,
        userID: userExists.id,
      });
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
