import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/prisma-client";

import { IProductCardContainerData } from "../../components/product-card-container/product-card-container.component";
import { IApiError } from "./auth/login";

export default async function searchHandler(
  req: NextApiRequest,
  res: NextApiResponse<
    IProductCardContainerData | IApiError
  >
) {
  if (req.method === "GET") {
    try {
      const { q: searchQuery } = await req.query;
      if (!searchQuery) {
        res.status(400);
        throw new Error("All fields are required.");
      }
      if (searchQuery.length < 3) {
        res.status(400);
        throw new Error(
          "Search query needs to be bigger than 3 characters."
        );
      }
      const itemQuery = await prisma.item.findMany({
        where: {
          name: {
            contains: searchQuery as string,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          images: true,
          name: true,
          price: true,
          offer: true,
          dsicountedPrice: true,
          currentInventory: true,
        },
      });
      const categoryQuery = await prisma.category.findMany({
        where: {
          name: {
            contains: searchQuery as string,
            mode: "insensitive",
          },
        },
        select: {
          items: {
            select: {
              id: true,
              images: true,
              name: true,
              price: true,
              offer: true,
              dsicountedPrice: true,
              currentInventory: true,
            },
          },
        },
      });
      const queryResponse = {
        name: "Results",
        items: itemQuery,
      };
      categoryQuery.map((category) => {
        queryResponse.items = [
          ...queryResponse.items,
          ...category.items,
        ];
      });
      queryResponse.items = queryResponse.items.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (nestedItem) => nestedItem.id === item.id
          )
      );
      if (queryResponse.items.length === 0) {
        return res.status(404).json({
          status: "ERROR",
          message: "No results could be found.",
        });
      }
      return res.json({ ...queryResponse });
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
