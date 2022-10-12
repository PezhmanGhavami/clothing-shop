import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { Review } from "@prisma/client";

import { sessionOptions } from "../../../utils/session";
import { prisma } from "../../../utils/prisma-client";

import { IApiError } from "../auth/login";

export default withIronSessionApiRoute(
  reviewRoute,
  sessionOptions
);

async function reviewRoute(
  req: NextApiRequest,
  res: NextApiResponse<Review | Review[] | IApiError>
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

      const item = await prisma.item.findUnique({
        where: {
          id: itemID,
        },
      });

      if (item) {
        const updatedItem = await prisma.item.update({
          where: {
            id: itemID,
          },
          data: {
            reviews: {
              create: {
                title,
                body,
                rating,
                user: { connect: { id: user.userID } },
              },
            },
            reviewsAvgRating:
              (item.reviewsAvgRating * item.reviewsCount +
                rating) /
              (item.reviewsCount + 1),
            reviewsCount: {
              increment: 1,
            },
            [`reviewsRated${rating}Count`]: {
              increment: 1,
            },
          },
          select: {
            reviews: true,
          },
        });
        if (updatedItem) {
          res.json({
            ...updatedItem.reviews[
              updatedItem.reviews.length - 1
            ],
          });
        }
      }
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
