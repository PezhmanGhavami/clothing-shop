import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

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

export const getServerSession = async (
  headers: Headers,
  cookies: ReadonlyRequestCookies,
) => {
  const req = {
    headers: headers,
    cookies: cookies,
  };
  const res = {
    getHeader: headers.get,
    setCookie: cookies.set,
    setHeader: headers.set,
  };

  // @ts-ignore
  return getSession(req, res);
};

export { createResponse };
