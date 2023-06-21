import bcrypt from "bcryptjs";

import { getSession, createResponse } from "@/utils/session";
import { prisma } from "@/utils/prisma-client";

import type { IUser, IApiMessage } from "../route";

export async function POST(req: Request) {
  const res = new Response();
  const session = await getSession(req, res);
  const resInit: ResponseInit = {
    status: 200,
    headers: { "Content-Type": "application/json" },
  };

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      resInit.status = 400;
      throw new Error("All fields are required.");
    }

    const lowerCaseEmail = (email as string).toLowerCase();

    const userExists = await prisma.user.findUnique({
      where: {
        email: lowerCaseEmail,
      },
      include: {
        cart: true,
      },
    });
    if (!userExists) {
      resInit.status = 401;
      throw new Error("Wrong email or password");
    }

    const passwordIsCorrect = await bcrypt.compare(
      password,
      userExists.password,
    );
    if (!passwordIsCorrect) {
      resInit.status = 401;
      throw new Error("Wrong email or password");
    }
    const user = {
      userID: userExists.id,
      dateCreated: Date.now(),
    };
    session.user = user;
    if (userExists.cart) {
      const cartItems = JSON.parse(userExists.cart.items);
      session.cart = {
        ...userExists.cart,
        items: cartItems,
      };
    } else {
      const updatedUser = await prisma.user.update({
        where: {
          id: userExists.id,
        },
        data: {
          cart: {
            create: {
              items: "[]",
              count: 0,
              total: 0.0,
              discountedTotal: 0.0,
            },
          },
        },
        include: { cart: true },
      });
      if (updatedUser.cart) {
        session.cart = {
          ...updatedUser.cart,
          items: [],
        };
      }
    }
    await session.save();

    const payload: IUser | IApiMessage = {
      isLoggedIn: true,
      userID: userExists.id,
    };

    return createResponse(res, JSON.stringify(payload), resInit);
  } catch (error) {
    const payload: IUser | IApiMessage = {
      status: "ERROR",
      message: (error as Error).message,
    };

    return createResponse(res, JSON.stringify(payload), resInit);
  }
}
