import express from "express";

import * as itemsController from "../controllers/items-controller";
import isAdmin from "../middlewares/admin-middleware";

const itemsRouter = express.Router();

// itemsRouter
//   .route("/")
//   .post(isAdmin, itemsController.createItem);
// .get(itemsController.getItems);

itemsRouter
  .route("/:itemID")
  .get(itemsController.getItem)
  // .put(isAdmin, itemsController.updateItem)
  // .delete(isAdmin, itemsController.deleteItem);

export default itemsRouter;
