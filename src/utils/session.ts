import { getIronSession, createResponse } from "iron-session";

import { ICart } from "@/app/api/cart/route";
export interface IIronSessionData {
  user?: {
    userId: string;
    dateCreated: number;
  };
  cart?: ICart;
}

export const getSession = (req: Request, res: Response) => {
  return getIronSession<IIronSessionData>(req, res, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "clothingShopSeal",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
};

export { createResponse };
