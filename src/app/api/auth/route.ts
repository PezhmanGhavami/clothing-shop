import bcrypt from "bcryptjs";

import { getSession, createResponse } from "@/utils/session";
import { prisma } from "@/utils/prisma-client";

export interface IApiMessage {
  status: "ERROR" | "SUCCESS";
  message: string;
}
export interface IUser {
  isLoggedIn: boolean;
  userID: string;
}

export async function GET(req: Request) {
  const res = new Response();
  const session = await getSession(req, res);
  const resInit: ResponseInit = {
    status: 200,
    headers: { "Content-Type": "application/json" },
  };
  const { user } = session;

  if (user) {
    if (Date.now() - user.dateCreated > 1000 * 60 * 60 * 24) {
      const newUser = {
        ...user,
        dateCreated: Date.now(),
      };
      session.user = newUser;
      await session.save();
    }

    const payload: IUser | IApiMessage = {
      isLoggedIn: true,
      userID: user.userID,
    };

    return createResponse(res, JSON.stringify(payload), resInit);
  }

  const payload: IUser | IApiMessage = {
    isLoggedIn: false,
    userID: "",
  };

  return createResponse(res, JSON.stringify(payload), resInit);
}

export async function POST(req: Request) {
  const res = new Response();
  const resInit: ResponseInit = {
    status: 200,
    headers: { "Content-Type": "application/json" },
  };
  const session = await getSession(req, res);

  try {
    const { email, password, displayName, confirmPassword } = await req.json();

    if (!email || !password || !displayName || !confirmPassword) {
      resInit.status = 400;
      throw new Error("All fields are required.");
    }

    if (password !== confirmPassword) {
      resInit.status = 400;
      throw new Error("Passwords should match.");
    }

    const lowerCaseEmail = (email as string).toLowerCase();

    const userExists = await prisma.user.findUnique({
      where: {
        email: lowerCaseEmail,
      },
    });
    if (userExists) {
      resInit.status = 401;
      throw new Error("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email: lowerCaseEmail,
        password: hashedPassword,
        displayName,
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

    const user = {
      userID: newUser.id,
      dateCreated: Date.now(),
    };
    session.user = user;
    if (newUser.cart) {
      session.cart = {
        ...newUser.cart,
        items: [],
      };
    }
    await session.save();

    const payload: IUser | IApiMessage = {
      isLoggedIn: true,
      userID: newUser.id,
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
