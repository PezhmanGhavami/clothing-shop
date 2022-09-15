import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcryptjs";

import { sessionOptions } from "../../../utils/session";
import { prisma } from "../../../utils/prisma-client";

import type { IUser } from "./user";
import type { IApiError } from "./login";

export default withIronSessionApiRoute(
  loginRoute,
  sessionOptions
);

async function loginRoute(
  req: NextApiRequest,
  res: NextApiResponse<IUser | IApiError>
) {
  if (req.method === "POST") {
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
        },
      });

      const user = {
        isLoggedIn: true,
        userId: newUser.id,
        cartId:
          "Some cart ID that belongs to " + newUser.id,
      } as IUser;
      req.session.user = user;
      await req.session.save();
      res.json(user);
    } catch (error) {
      res.json({
        status: "ERROR",
        message: (error as Error).message,
      });
    }
  }
}
