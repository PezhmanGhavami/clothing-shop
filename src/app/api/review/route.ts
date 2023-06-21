import { User, Review, Prisma } from "@prisma/client";

import { getSession, createResponse } from "@/utils/session";
import { prisma } from "@/utils/prisma-client";

import { IApiMessage } from "../auth/route";
export type ReviewPopulatedWithUser = Review & {
  user: User;
};
export interface IReviewResponse {
  reviews?: Review[];
  pages: number;
}

export async function GET(req: Request) {
  const res = new Response();
  const session = await getSession(req, res);
  const resInit: ResponseInit = {
    status: 200,
    headers: { "Content-Type": "application/json" },
  };
  const { searchParams } = new URL(req.url);

  try {
    const page = searchParams.get("page");
    const itemId = searchParams.get("itemId");
    const sortBy = searchParams.get("sortBy");
    const sortMethod = searchParams.get("sortMethod");
    const selectedFilter = searchParams.get("selectedFilter");
    const showUserReviews = searchParams.get("showUserReviews");

    if (!itemId || !sortBy || !sortMethod || !page) {
      resInit.status = 400;
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
      const user = session.user;
      if (!user) {
        resInit.status = 401;
        throw new Error("You need to be logged in to see your own reviews.");
      }
      filter = {
        ...filter,
        user: { id: user.userId },
      };
      delete filter.published;
    }

    const reviewsPerPage = 10;
    const skip = {
      skip: parseInt(page as string) * reviewsPerPage,
    };

    const reviews = await prisma.item.findUnique({
      where: {
        id: itemId as string,
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
            [sortBy as string]: sortMethod as Prisma.SortOrder,
          },
          ...skip,
          take: reviewsPerPage,
        },
      },
    });

    if (reviews?.reviews) {
      let pages;

      if (filter.user) {
        let ratingFilter = {};
        if (filter.rating) {
          ratingFilter = { rating: filter.rating };
        }
        const userReviews = await prisma.user.findUnique({
          where: {
            id: filter.user.id,
          },
          select: {
            reviews: {
              where: {
                itemId: itemId as string,
                ...ratingFilter,
              },
              select: {
                id: true,
              },
            },
          },
        });
        pages = (userReviews?.reviews.length || 1) / reviewsPerPage;
      } else if (filter.rating) {
        pages = pages = Math.floor(
          reviews[`reviewsRated${filter.rating as 1 | 2 | 3 | 4 | 5}Count`] /
            reviewsPerPage,
        );
      } else {
        pages = Math.floor(reviews.reviewsCount / reviewsPerPage);
      }

      const payload: IReviewResponse | IApiMessage = {
        reviews: reviews.reviews,
        pages,
      };

      return createResponse(res, JSON.stringify(payload), resInit);
    }

    resInit.status = 404;
    throw new Error("The resource you are looking for doesn not exist.");
  } catch (error) {
    const payload: IReviewResponse | IApiMessage = {
      status: "ERROR",
      message: (error as Error).message,
    };

    return createResponse(res, JSON.stringify(payload), resInit);
  }
}

export async function POST(req: Request) {
  const res = new Response();
  const session = await getSession(req, res);
  const resInit: ResponseInit = {
    status: 200,
    headers: { "Content-Type": "application/json" },
  };

  try {
    const user = session.user;
    if (!user) {
      resInit.status = 401;
      throw new Error("You need to be logged in before you can post a review.");
    }

    const { title, body, rating, itemId } = await req.json();
    if (!title || !body || !rating || !itemId) {
      resInit.status = 400;
      throw new Error("All fields are required.");
    }

    const item = await prisma.item.findUnique({
      where: {
        id: itemId as string,
      },
    });

    if (!item) {
      resInit.status = 400;
      throw new Error("The product you are trying to review does not exist.");
    }

    const updatedItem = await prisma.item.update({
      where: {
        id: itemId as string,
      },
      data: {
        reviews: {
          create: {
            title,
            body,
            rating,
            user: { connect: { id: user.userId } },
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
      resInit.status = 201;

      const payload: IReviewResponse | IApiMessage = {
        status: "SUCCESS",
        message:
          "Review created successfully; after reappraisal it will be published.\nYou can still view and edit your review before it is approved.",
      };

      return createResponse(res, JSON.stringify(payload), resInit);
    }
  } catch (error) {
    resInit.status = resInit.status === 200 ? 500 : resInit.status;

    const payload: IApiMessage = {
      status: "ERROR",
      message: (error as Error).message,
    };

    return createResponse(res, JSON.stringify(payload), resInit);
  }
}
