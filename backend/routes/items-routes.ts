import express from "express";

import * as itemsController from "../controllers/items-controller";
import isAdmin from "../middlewares/admin-middleware";

const itemsRouter = express.Router();

itemsRouter
  .route("/")
  .post(isAdmin, itemsController.addItem)
  .get(itemsController.getItems);

  itemsRouter
  .route("/:categoryID")
  .get(itemsController.getItem)
  .put(isAdmin, itemsController.editItem)
  .delete(isAdmin, itemsController.deleteItem);

export default itemsRouter;
