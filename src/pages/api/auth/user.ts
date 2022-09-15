import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../utils/session";
import { NextApiRequest, NextApiResponse } from "next";

export interface IUser {
  isLoggedIn: boolean;
  userId: string;
  cartId: string;
}

export default withIronSessionApiRoute(
  userRoute,
  sessionOptions
);

async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse<IUser>
) {
  if (req.session.user) {
    console.log(req.session.user);
    res.json({
      ...req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
      userId: "",
      cartId: "",
    });
  }
}
