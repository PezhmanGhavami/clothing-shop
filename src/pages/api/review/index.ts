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
  cursor: string;
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
    const { itemID, sortBy, sortMethod, selectedFilter } =
      req.query;
    if (!itemID || !sortBy || !sortMethod) {
      res.status(400);
      throw new Error("All fields are required");
    }

    let filter: {
      where: { published: boolean; rating?: number };
    } = {
      where: {
        published: true,
      },
    };

    if (selectedFilter) {
      filter = {
        where: {
          ...filter.where,
          rating: parseInt(selectedFilter as string),
        },
      };
    }

    if (req.method === "GET") {
      const reviews = await prisma.item.findUnique({
        where: {
          id: itemID as string,
        },
        select: {
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
          cursor:
            reviews.reviews[reviews.reviews.length - 1].id,
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

      const { title, body, rating } = await req.body;
      if (!title || !body || !rating) {
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
        return res.json({
          status: "SUCCESS",
          message:
            "Review created successfully; after review it will be published.",
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
