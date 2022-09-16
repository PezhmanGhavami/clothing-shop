import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";

import { sessionOptions } from "../../../utils/session";
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
  }
  return res
    .status(400)
    .json({ status: "ERROR", message: "Bad Request." });
}
