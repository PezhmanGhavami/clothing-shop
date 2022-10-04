import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcryptjs";

import { sessionOptions } from "../../../utils/session";
import { prisma } from "../../../utils/prisma-client";

import type { IUser } from "./index";

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
        userID: userExists.id,
        dateCreated: Date.now(),
      };
      req.session.user = user;
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
