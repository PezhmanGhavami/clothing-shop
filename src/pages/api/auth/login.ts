import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcryptjs";

import { sessionOptions } from "../../../utils/session";
import { prisma } from "../../../utils/prisma-client";

import type { IUser } from "./user";

export default withIronSessionApiRoute(
  loginRoute,
  sessionOptions
);

export interface IApiError {
  status: "ERROR";
  message: string;
}

async function loginRoute(
  req: NextApiRequest,
  res: NextApiResponse<IUser | IApiError>
) {
  if (req.method === "POST") {
    try {
      const { email, password } = await req.body;

      if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required.");
      }

      const userExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!userExists) {
        res.status(401);
        throw new Error("Wrong email or password");
      }

      const passwordIsCorrect = await bcrypt.compare(
        password,
        userExists.password
      );
      if (!passwordIsCorrect) {
        res.status(401);
        throw new Error("Wrong email or password");
      }

      const user = {
        isLoggedIn: true,
        userId: userExists.id,
        cartId:
          "Some cart ID that belongs to " + userExists.id,
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
