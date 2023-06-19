import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { IUser } from "./index";
import { IApiMessage } from "./login";
import { sessionOptions } from "../../../utils/session";

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

function logoutRoute(
  req: NextApiRequest,
  res: NextApiResponse<IUser | IApiMessage>,
) {
  if (req.method === "GET") {
    req.session.destroy();
    return res.redirect("/");
  }
  return res.status(400).json({ status: "ERROR", message: "Bad Request." });
}
