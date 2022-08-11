import prisma from "../utils/prisma-client";
import { IExpressEndpointHandler } from "../utils/types";

/**
 * @desc   Creates a new category
 * @route  POST /api/categories
 * @access Admin
 * */
const createCategory: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("All feilds are required.");
  }

  prisma.category
    .findUnique({ where: { name } })
    .then((categoryExists) => {
      if (categoryExists) {
        res.status(400);
        throw new Error("Category already exists.");
      }
    })
    .then(() =>
      prisma.category.create({
        data: {
          name,
        },
      })
    )
    .then((category) => {
      res.status(201).json({
        id: category.id,
        name: category.name,
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
 * @desc   Gets all items of a category
 * @route  GET /api/categories/:categoryID
 * @access Public
 * */
const getCategory: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const { categoryID } = req.params;

  prisma.category
    .findUnique({
      where: { id: categoryID },
      include: {
        items: true,
      },
    })
    .then((category) => {
      if (category) {
        return res.status(200).json({
          ...category,
        });
      }
      res.status(404);
      throw new Error("Category doesn't exist.");
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
 * @desc   Edits a category
 * @route  PUT /api/categories/:categoryID
 * @access Admin
 * */
const updateCategory: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const { categoryID } = req.params;
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

  return prisma.category
    .update({
      data: {
        ...payload,
      },
      where: { id: categoryID },
    })
    .then((category) => {
      return res.status(202).json({
        ...category,
      });
    })
    .catch((error) => {
      if (res.statusCode !== 200) {
        return next(error);
      }
      if (error.code === "P2025") {
        res.status(400);
        return next(new Error("Category doesn't exist."));
      }
      console.log(error);
      res.status(500);
      return next(new Error("Something went wrong."));
    });
};

/**
 * @desc   Deletes a category
 * @route  DELETE /api/categories/:categoryID
 * @access Admin
 * */
const deleteCategory: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const { categoryID } = req.params;

  prisma.category
    .delete({
      where: { id: categoryID },
    })
    .then((category) =>
      res.status(202).json({
        ...category,
      })
    )
    .catch((error) => {
      if (error.code === "P2025") {
        res.status(400);
        return next(new Error("Category doesn't exist."));
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
const getCategories: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  prisma.category
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
  createCategory,
  getCategory,
  updateCategory,
  getCategories,
  deleteCategory,
};
