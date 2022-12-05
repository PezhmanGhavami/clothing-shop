import type { IronSessionOptions } from "iron-session";
import { ICart } from "../pages/api/cart";

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "clothingShopSeal",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      userID: string;
      dateCreated: number;
    };
    cart?: ICart;
  }
}
