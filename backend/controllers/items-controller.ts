import prisma from "../utils/prisma-client";
import { IExpressEndpointHandler } from "../utils/types";

/**
 * @desc   Creates a new item
 * @route  POST /api/items
 * @access Admin
 * */
const createItem: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const {
    name,
    price,
    imageUrls,
    brandID,
    currentInventory,
    description,
    categories,
  } = req.body;

  if (!name || !price) {
    res.status(400);
    throw new Error("All feilds with stars are required.");
  }

  //TODO Validate all form inputes - make a function that you can use both in the front end and backend
  //TODO - Expand on the idea of a function validator and add it to other controllers, and their respective components on the frontend
  //TODO - Make a payload variable and use it to validate, and add unnecessary data

  prisma.item
    .findUnique({ where: { name } })
    .then((itemExists) => {
      if (itemExists) {
        res.status(400);
        throw new Error("Item already exists.");
      }
    })
    .then(() =>
      prisma.item.create({
        data: {
          name,
          price,
          images: imageUrls,
          brand: { connect: { id: brandID } },
          currentInventory,
          description,
          categories: {
            connect: categories,
          },
        },
      })
    )
    .then((item) => {
      res.status(201).json({
        id: item.id,
        name: item.name,
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
 * @desc   Gets all items of a item
 * @route  GET /api/items/:itemID
 * @access Public
 * */
const getItem: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const { itemID } = req.params;

  prisma.item
    .findUnique({
      where: { id: itemID },
      include: {
        categories: true,
        brand: true,
      },
    })
    .then((item) => {
      if (item) {
        return res.status(200).json({
          ...item,
        });
      }
      res.status(404);
      throw new Error("Item doesn't exist.");
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
 * @desc   Updates an item
 * @route  PUT /api/items/:itemID
 * @access Admin
 * */
// const updateItem: IExpressEndpointHandler = (
//   req,
//   res,
//   next
// ) => {
//   const { itemID } = req.params;
//   const { name, items } = req.body;

//   interface IItem {
//     id: string;
//   }

//   const payload: {
//     name?: string;
//     items?: { connect?: IItem[]; disconnect?: IItem[] };
//   } = {};

//   if (name && typeof name === "string") {
//     payload.name = name;
//   }

//   if (items) {
//     if (
//       items.add &&
//       Array.isArray(items.add) &&
//       items.add.length > 0
//     ) {
//       const structureIsCorrect = (
//         items.add as IItem[]
//       ).every(
//         (item) => item.id && typeof item.id === "string"
//       );

//       if (structureIsCorrect) {
//         payload.items = {
//           connect: (items.add as IItem[]).map((item) => {
//             return { id: item.id };
//           }),
//         };
//       }
//     }

//     if (
//       items.remove &&
//       Array.isArray(items.remove) &&
//       items.remove.length > 0
//     ) {
//       const structureIsCorrect = (
//         items.remove as IItem[]
//       ).every(
//         (item) => item.id && typeof item.id === "string"
//       );
//       if (structureIsCorrect) {
//         payload.items = {
//           disconnect: (items.remove as IItem[]).map(
//             (item) => {
//               return { id: item.id };
//             }
//           ),
//           ...payload.items,
//         };
//       }
//     }
//   }

//   function itemUpdate() {
//     return prisma.item
//       .update({
//         data: {
//           ...payload,
//         },
//         where: { id: itemID },
//       })
//       .then((item) => {
//         return res.status(202).json({
//           ...item,
//         });
//       })
//       .catch((error) => {
//         if (res.statusCode !== 200) {
//           return next(error);
//         }
//         if (error.code === "P2025") {
//           res.status(400);
//           return next(new Error("Item doesn't exist."));
//         }
//         console.log(error);
//         res.status(500);
//         return next(new Error("Something went wrong."));
//       });
//   }

//   if (payload.items?.disconnect) {
//     const prismaItemsTransactions =
//       payload.items.disconnect.map((item) => {
//         return prisma.item.update({
//           data: {
//             item: {
//               connectOrCreate: {
//                 create: { name: "Unknown" },
//                 where: { name: "Unknown" },
//               },
//             },
//           },
//           where: {
//             id: item.id,
//           },
//         });
//       });

//     delete payload.items.disconnect;

//     return prisma
//       .$transaction(prismaItemsTransactions)
//       .then(() => itemUpdate());
//   }

//   itemUpdate();
// };

/**
 * @desc   Deletes an item
 * @route  DELETE /api/items/:itemID
 * @access Admin
 * */
const deleteItem: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  const { itemID } = req.params;

  //TODO - handle reviews when an item is deleted

  prisma.item
    .delete({
      where: { id: itemID },
    })
    .then((item) =>
      res.status(202).json({
        ...item,
      })
    )
    .catch((error) => {
      if (error.code === "P2025") {
        res.status(400);
        return next(new Error("Item doesn't exist."));
      }
      console.log(error);
      res.status(500);
      return next(new Error("Something went wrong."));
    });
};

/**
 * @desc   Gets all of the items with page support, each page will have 9 items, with filter and sort capability
 * @route  GET /api/items
 * @access Public
 * */
const getItems: IExpressEndpointHandler = (
  req,
  res,
  next
) => {
  //TODO - this will need optional orderby, optional filters based on brand categories, etc
  //TODO - make pagination work both for this and the category and brand item getters
  prisma.item
    .findMany({
      take: 8,
    })
    .then((items) => {
      if (items) {
        return res.status(202).json(items);
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
  // createItem,
  getItem,
  // updateItem,
  // getItems,
  // deleteItem,
};
