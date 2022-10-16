import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { User, Review, Prisma } from "@prisma/client";

import { sessionOptions } from "../../../utils/session";
import { prisma } from "../../../utils/prisma-client";

import { IApiMessage } from "../auth/login";
export type reviewPopulatedWithUser = Review & {
  user: User;
};
export interface IApiSucess {}
export interface IReviewResponse {
  reviews: Review[];
  pages: number;
}

export default withIronSessionApiRoute(
  reviewRoute,
  sessionOptions
);

async function reviewRoute(
  req: NextApiRequest,
  res: NextApiResponse<IReviewResponse | IApiMessage>
) {
  try {
    if (req.method === "GET") {
      const {
        page,
        itemID,
        sortBy,
        sortMethod,
        selectedFilter,
        showUserReviews,
      } = req.query;
      if (!itemID || !sortBy || !sortMethod || !page) {
        res.status(400);
        throw new Error("All fields are required");
      }

      let filter: {
        rating?: number;
        user?: { id: string };
        published?: boolean;
      } = { published: true };

      if (selectedFilter) {
        filter = {
          ...filter,
          rating: parseInt(selectedFilter as string),
        };
      }

      if (showUserReviews === "true") {
        const user = req.session.user;
        if (!user) {
          res.status(401);
          throw new Error(
            "You need to be logged in to see your own reviews."
          );
        }
        filter = {
          ...filter,
          user: { id: user.userID },
        };
        delete filter.published;
      }

      const reviewsPerPage = 10;
      const skip = {
        skip: parseInt(page as string) * reviewsPerPage,
      };

      const reviews = await prisma.item.findUnique({
        where: {
          id: itemID as string,
        },
        select: {
          reviewsCount: true,
          reviewsRated1Count: true,
          reviewsRated2Count: true,
          reviewsRated3Count: true,
          reviewsRated4Count: true,
          reviewsRated5Count: true,
          reviews: {
            where: {
              ...filter,
            },
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
            ...skip,
            take: reviewsPerPage,
          },
        },
      });

      if (reviews?.reviews) {
        let pages;
        if (filter.rating) {
          pages = pages = Math.floor(
            reviews[
              `reviewsRated${
                filter.rating as 1 | 2 | 3 | 4 | 5
              }Count`
            ] / reviewsPerPage
          );
        } else {
          pages = Math.floor(
            reviews.reviewsCount / reviewsPerPage
          );
        }

        return res.json({
          reviews: reviews.reviews,
          pages,
        });
      }

      res.status(404);
      throw new Error(
        "The resource you are looking for doesn not exist."
      );
    } else if (req.method === "POST") {
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
          id: itemID as string,
        },
      });

      if (!item) {
        res.status(400);
        throw new Error(
          "The product you are trying to review does not exist."
        );
      }

      const updatedItem = await prisma.item.update({
        where: {
          id: itemID as string,
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
          // TODO - add a way to publish reviews and then update the item with the below values
          // reviewsAvgRating: parseFloat(
          //   (
          //     (item.reviewsAvgRating * item.reviewsCount +
          //       rating) /
          //     (item.reviewsCount + 1)
          //   ).toFixed(1)
          // ),
          // reviewsCount: {
          //   increment: 1,
          // },
          // [`reviewsRated${rating}Count`]: {
          //   increment: 1,
          // },
        },
        select: {
          id: true,
        },
      });
      if (updatedItem) {
        return res.status(201).json({
          status: "SUCCESS",
          message:
            "Review created successfully; after reappraisal it will be published.\nYou can still view and edit your review before it is approved.",
        });
      }
    }

    res.status(400);
    throw new Error("Bad Request.");
  } catch (error) {
    return res.json({
      status: "ERROR",
      message: (error as Error).message,
    });
  }
}
