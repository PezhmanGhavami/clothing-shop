import { User, Review, Prisma } from "@prisma/client";

import { getSession, createResponse } from "@/utils/session";
import { prisma } from "@/utils/prisma-client";

import { IApiMessage } from "@/app/api/auth/route";

interface IRouteSegment {
  params: { reviewId: string };
}

type verb = "edit" | "delete";
const errorMessags = {
  noUser(verb: verb) {
    return `You need to be logged in before you can ${verb} a review.`;
  },
  noReview(verb: verb) {
    return `The review you are trying to ${verb} does not exist.`;
  },
  noPremission(verb: verb) {
    return `You don't have permission to ${verb} this review.`;
  },
};

export async function PUT(req: Request, { params }: IRouteSegment) {
  const res = new Response();
  const session = await getSession(req, res);
  const resInit: ResponseInit = {
    headers: { "Content-Type": "application/json" },
  };
  const { reviewId } = params;

  try {
    const { rating, title, body } = await req.json();

    if (!rating || !title || !body) {
      resInit.status = 400;
      throw new Error("All fields are required");
    }

    const user = session.user;
    if (!user) {
      resInit.status = 401;
      throw new Error(errorMessags.noUser("edit"));
    }

    const review = await prisma.review.findUnique({
      where: {
        id: reviewId as string,
      },
      select: {
        userId: true,
      },
    });

    if (!review) {
      resInit.status = 404;
      throw new Error(errorMessags.noReview("edit"));
    }

    if (review.userId !== user.userId) {
      resInit.status = 403;
      throw new Error(errorMessags.noPremission("edit"));
    }

    const editedReview = await prisma.review.update({
      where: {
        id: reviewId as string,
      },
      data: {
        rating,
        title,
        body,
        published: false,
      },
      select: {
        id: true,
      },
    });
    if (editedReview) {
      resInit.status = 201;

      const payload: IApiMessage = {
        status: "SUCCESS",
        message: "Review edited successfully.",
      };

      return createResponse(res, JSON.stringify(payload), resInit);
    }
  } catch (error) {
    resInit.status = resInit.status ? resInit.status : 500;

    const payload: IApiMessage = {
      status: "ERROR",
      message: (error as Error).message,
    };

    return createResponse(res, JSON.stringify(payload), resInit);
  }
}

export async function DELETE(req: Request, { params }: IRouteSegment) {
  const res = new Response();
  const session = await getSession(req, res);
  const resInit: ResponseInit = {
    headers: { "Content-Type": "application/json" },
  };
  const { reviewId } = params;

  try {
    const user = session.user;
    if (!user) {
      resInit.status = 401;
      throw new Error(errorMessags.noUser("edit"));
    }

    const review = await prisma.review.findUnique({
      where: {
        id: reviewId as string,
      },
      select: {
        userId: true,
      },
    });

    if (!review) {
      resInit.status = 404;
      throw new Error(errorMessags.noReview("edit"));
    }

    if (review.userId !== user.userId) {
      resInit.status = 403;
      throw new Error(errorMessags.noPremission("edit"));
    }

    const deletedReview = await prisma.review.delete({
      where: {
        id: reviewId as string,
      },
      select: {
        id: true,
      },
    });
    if (deletedReview) {
      resInit.status = 200;

      const payload: IApiMessage = {
        status: "SUCCESS",
        message: "Review deleted successfully.",
      };

      return createResponse(res, JSON.stringify(payload), resInit);
    }
  } catch (error) {
    resInit.status = resInit.status ? resInit.status : 500;

    const payload: IApiMessage = {
      status: "ERROR",
      message: (error as Error).message,
    };

    return createResponse(res, JSON.stringify(payload), resInit);
  }
}
