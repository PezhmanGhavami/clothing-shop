import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";

import { sessionOptions } from "../../../utils/session";
import { prisma } from "../../../utils/prisma-client";

import { IApiMessage } from "../auth/login";

export default withIronSessionApiRoute(
  reviewRoute,
  sessionOptions
);

async function reviewRoute(
  req: NextApiRequest,
  res: NextApiResponse<IApiMessage>
) {
  try {
    const { reviewID } = req.query;
    console.log(reviewID);

    const verb =
      req.method === "PUT"
        ? "edit"
        : req.method === "DELETE"
        ? "delete"
        : "";

    if (verb === "") {
      res.status(400);
      throw new Error("Bad Request.");
    }

    const user = req.session.user;
    if (!user) {
      res.status(401);
      throw new Error(
        `You need to be logged in before you can ${verb} a review.`
      );
    }

    const review = await prisma.review.findUnique({
      where: {
        id: reviewID as string,
      },
      select: {
        userId: true,
      },
    });

    if (!review) {
      res.status(404);
      throw new Error(
        `The review you are trying to ${verb} does not exist.`
      );
    }

    if (review.userId !== user.userID) {
      res.status(403);
      throw new Error(
        `You don't have permission to ${verb} this review.`
      );
    }

    if (req.method === "PUT") {
      const { rating, title, body } = await req.body;
      if (!rating || !title || !body) {
        res.status(400);
        throw new Error("All fields are required");
      }

      const editedReview = await prisma.review.update({
        where: {
          id: reviewID as string,
        },
        data: {
          rating,
          title,
          body,
        },
        select: {
          id: true,
        },
      });
      if (editedReview) {
        return res.status(201).json({
          status: "SUCCESS",
          message: "Review edited successfully.",
        });
      }
    } else if (req.method === "DELETE") {
      const deletedReview = await prisma.review.delete({
        where: {
          id: reviewID as string,
        },
        select: {
          id: true,
        },
      });
      if (deletedReview) {
        return res.status(200).json({
          status: "SUCCESS",
          message: "Review deleted successfully.",
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
