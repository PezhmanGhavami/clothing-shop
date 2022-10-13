import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { User, Review, Prisma } from "@prisma/client";

import { sessionOptions } from "../../../utils/session";
import { prisma } from "../../../utils/prisma-client";

import { IApiError } from "../auth/login";
export type reviewPopulatedWithUser = Review & {
  user: User;
};
export interface IRatingCounts {
  rated1: number;
  rated2: number;
  rated3: number;
  rated4: number;
  rated5: number;
}
export interface IMetaData {
  avgRating: number;
  reviewsCount: number;
  cursor: string;
  ratingCounts: IRatingCounts;
}
interface IReviewResponse {
  metaData: IMetaData;
  reviews: Review[];
}

export default withIronSessionApiRoute(
  reviewRoute,
  sessionOptions
);

async function reviewRoute(
  req: NextApiRequest,
  res: NextApiResponse<IReviewResponse | Review | IApiError>
) {
  if (req.method === "GET") {
    try {
      const { itemID, sortBy, sortMethod, selectedFilter } =
        req.query;
      if (!itemID || !sortBy || !sortMethod) {
        res.status(400);
        throw new Error("All fields are required");
      }

      let filter = {};

      if (selectedFilter) {
        filter = {
          where: {
            rating: parseInt(selectedFilter as string),
          },
        };
      }

      const reviews = await prisma.item.findUnique({
        where: {
          id: itemID as string,
        },
        select: {
          reviewsAvgRating: true,
          reviewsCount: true,
          reviewsRated1Count: true,
          reviewsRated2Count: true,
          reviewsRated3Count: true,
          reviewsRated4Count: true,
          reviewsRated5Count: true,
          reviews: {
            ...filter,
            include: {
              user: {
                select: {
                  displayName: true,
                },
              },
            },
            orderBy: {
              [sortBy as string]:
                sortMethod as Prisma.SortOrder,
            },
            take: 5,
          },
        },
      });

      if (reviews?.reviews) {
        return res.json({
          reviews: reviews.reviews,
          metaData: {
            avgRating: reviews.reviewsAvgRating,
            reviewsCount: reviews.reviewsCount,
            cursor:
              reviews.reviews[reviews.reviews.length - 1]
                .id,
            ratingCounts: {
              rated1: reviews.reviewsRated1Count,
              rated2: reviews.reviewsRated2Count,
              rated3: reviews.reviewsRated3Count,
              rated4: reviews.reviewsRated4Count,
              rated5: reviews.reviewsRated5Count,
            },
          },
        });
      }

      res.status(404);
      throw new Error(
        "The resource you are looking for doesn not exist."
      );
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
            reviewsAvgRating: parseFloat(
              (
                (item.reviewsAvgRating * item.reviewsCount +
                  rating) /
                (item.reviewsCount + 1)
              ).toFixed(1)
            ),
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
          return res.json({
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
