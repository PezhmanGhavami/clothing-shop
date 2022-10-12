import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";

import { sessionOptions } from "../../../utils/session";
import { prisma } from "../../../utils/prisma-client";

import { IApiError } from "../auth/login";
interface IReview {
  title: string;
  body: string;
  rating: number;
}

export default withIronSessionApiRoute(
  reviewRoute,
  sessionOptions
);

async function reviewRoute(
  req: NextApiRequest,
  res: NextApiResponse<IReview | IReview[] | IApiError>
) {
  if (req.method === "GET") {
    try {
      const user = req.session.user;
      if (user) {
        // Add user reviews to the top
      }
      res.status(500);
      throw new Error("Not implemented yet.");
    } catch (error) {
      return res.json({
        status: "ERROR",
        message: (error as Error).message,
      });
    }
  } else if (req.method === "POST") {
    try {
      const user = req.session.user;
      if (!user) {
        res.status(401);
        throw new Error(
          "You need to be logged in before you can post a review."
        );
      }

      const { title, body, rating, itemID } =
        await req.body;
      if (!title || !body || !rating || !itemID) {
        res.status(400);
        throw new Error("All fields are required.");
      }

      const newReview = await prisma.review.create({
        data: {
          title,
          body,
          rating,
          Item: { connect: { id: itemID } },
          user: { connect: { id: user.userID } },
        },
      });

      return res.json({
        title: newReview.title,
        body: newReview.body,
        rating: newReview.rating,
      });
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
