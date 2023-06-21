import { createResponse } from "@/utils/session";
import { prisma } from "@/utils/prisma-client";

import { IProductCardContainerData } from "@/components/product-card-container/product-card-container.component";
import { IApiMessage } from "../auth/route";

export async function GET(req: Request) {
  const res = new Response();
  const { searchParams } = new URL(req.url);
  const resInit: ResponseInit = {
    headers: { "Content-Type": "application/json" },
  };

  try {
    const searchQuery = searchParams.get("q");

    if (!searchQuery) {
      resInit.status = 400;
      throw new Error("All fields are required.");
    }
    if (searchQuery.length < 3) {
      resInit.status = 400;
      throw new Error("Search query needs to be bigger than 3 characters.");
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
      queryResponse.items = [...queryResponse.items, ...category.items];
    });
    queryResponse.items = queryResponse.items.filter(
      (item, index, self) =>
        index === self.findIndex((nestedItem) => nestedItem.id === item.id),
    );
    if (queryResponse.items.length === 0) {
      resInit.status = 404;
      const payload: IApiMessage = {
        status: "ERROR",
        message: "No results could be found.",
      };

      return createResponse(res, JSON.stringify(payload), resInit);
    }

    const payload: IProductCardContainerData = {
      ...queryResponse,
    };

    return createResponse(res, JSON.stringify(payload), resInit);
  } catch (error) {
    resInit.status = resInit.status ? resInit.status : 500;

    const payload: IApiMessage = {
      status: "ERROR",
      message: (error as Error).message,
    };

    return createResponse(res, JSON.stringify(payload), resInit);
  }
}
