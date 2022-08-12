import prisma from "../utils/prisma-client";
import { IExpressEndpointHandler } from "../utils/types";

/**
 * @desc   Creates a new brand
 * @route  POST /api/brands
 * @access Admin
 * */
const createBrand: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("All feilds are required.");
  }

  prisma.brand
    .findUnique({ where: { name } })
    .then((brandExists) => {
      if (brandExists) {
        res.status(400);
        throw new Error("Brand already exists.");
      }
    })
    .then(() =>
      prisma.brand.create({
        data: {
          name,
        },
      })
    )
    .then((brand) => {
      res.status(201).json({
        id: brand.id,
        name: brand.name,
      });
    })
    .catch((error) => {
      if (res.statusCode !== 200) {
        return next(error);
      }
      console.log(error);
      res.status(500);
      return next(new Error("Couldn't save to DB."));
    });
};

/**
 * @desc   Gets all items of a brand
 * @route  GET /api/brands/:brandID
 * @access Public
 * */
const getBrand: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const { brandID } = req.params;

  prisma.brand
    .findUnique({
      where: { id: brandID },
      include: {
        items: true,
      },
    })
    .then((brand) => {
      if (brand) {
        return res.status(200).json({
          ...brand,
        });
      }
      res.status(404);
      throw new Error("Brand doesn't exist.");
    })
    .catch((error) => {
      if (res.statusCode !== 200) {
        return next(error);
      }
      console.log(error);
      res.status(500);
      return next(new Error("Something went wrong."));
    });
};

/**
 * @desc   Edits a brand
 * @route  PUT /api/categories/:brandID
 * @access Admin
 * */
const updateBrand: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const { brandID } = req.params;
  const { name, items } = req.body;

  interface IItem {
    id: string;
  }

  const payload: {
    name?: string;
    items?: { connect?: IItem[]; disconnect?: IItem[] };
  } = {};

  if (name && typeof name === "string") {
    payload.name = name;
  }

  if (items) {
    if (
      items.add &&
      Array.isArray(items.add) &&
      items.add.length > 0
    ) {
      const structureIsCorrect = (
        items.add as IItem[]
      ).every(
        (item) => item.id && typeof item.id === "string"
      );

      if (structureIsCorrect) {
        payload.items = {
          connect: (items.add as IItem[]).map((item) => {
            return { id: item.id };
          }),
        };
      }
    }

    if (
      items.remove &&
      Array.isArray(items.remove) &&
      items.remove.length > 0
    ) {
      const structureIsCorrect = (
        items.remove as IItem[]
      ).every(
        (item) => item.id && typeof item.id === "string"
      );
      if (structureIsCorrect) {
        payload.items = {
          disconnect: (items.remove as IItem[]).map(
            (item) => {
              return { id: item.id };
            }
          ),
          ...payload.items,
        };
      }
    }
  }

  return prisma.brand
    .update({
      data: {
        ...payload,
      },
      where: { id: brandID },
    })
    .then((brand) => {
      return res.status(202).json({
        ...brand,
      });
    })
    .catch((error) => {
      if (res.statusCode !== 200) {
        return next(error);
      }
      if (error.code === "P2025") {
        res.status(400);
        return next(new Error("Brand doesn't exist."));
      }
      console.log(error);
      res.status(500);
      return next(new Error("Something went wrong."));
    });
};

/**
 * @desc   Deletes a brand
 * @route  DELETE /api/categories/:brandID
 * @access Admin
 * */
const deleteBrand: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const { brandID } = req.params;

  prisma.brand
    .findUnique({
      where: {
        id: brandID,
      },
      include: {
        items: true,
      },
    })
    .then((brandWithItems) => {
      if (brandWithItems) {
        const prismaItemsTransactions =
          brandWithItems.items.map((item) => {
            return prisma.item.update({
              data: {
                brand: {
                  connectOrCreate: {
                    create: { name: "Unknown" },
                    where: { name: "Unknown" },
                  },
                },
              },
              where: {
                id: item.id,
              },
            });
          });
        return prisma.$transaction(prismaItemsTransactions);
      }
    })
    .then(() =>
      prisma.brand.delete({
        where: { id: brandID },
      })
    )
    .then((brand) =>
      res.status(202).json({
        ...brand,
      })
    )
    .catch((error) => {
      if (error.code === "P2025") {
        res.status(400);
        return next(new Error("Brand doesn't exist."));
      }
      console.log(error);
      res.status(500);
      return next(new Error("Something went wrong."));
    });
};

/**
 * @desc   Gets all of the categories plus 4 items for each
 * @route  GET /api/categories
 * @access Public
 * */
const getBrands: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  prisma.brand
    .findMany({
      include: {
        items: {
          take: 4,
        },
      },
    })
    .then((categories) => {
      if (categories) {
        return res.status(202).json(categories);
      }
      res.status(500);
      throw new Error("DB Error.");
    })
    .catch((error) => {
      if (res.statusCode !== 200) {
        return next(error);
      }
      console.log(error);
      res.status(500);
      return next(new Error("Something went wrong."));
    });
};

export {
  createBrand,
  getBrand,
  updateBrand,
  getBrands,
  deleteBrand,
};
