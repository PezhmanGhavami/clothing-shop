import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { IUser } from "./index";
import { IApiError } from "./login";
import { sessionOptions } from "../../../utils/session";

export default withIronSessionApiRoute(
  logoutRoute,
  sessionOptions
);

function logoutRoute(
  req: NextApiRequest,
  res: NextApiResponse<IUser | IApiError>
) {
  req.session.destroy();
  if (req.method === "POST") {
    return res.json({ isLoggedIn: false });
  } else if (req.method === "GET") {
    return res.redirect("/auth/signin");
  }
  return res
    .status(400)
    .json({ status: "ERROR", message: "Bad Request." });
}
