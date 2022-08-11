import express from "express";

import * as categoriesController from "../controllers/categories-controller";
import isAdmin from "../middlewares/admin-middleware";

const categoriesRouter = express.Router();

categoriesRouter
  .route("/")
  .post(isAdmin, categoriesController.createCategory)
  .get(categoriesController.getCategories);

categoriesRouter
  .route("/:categoryID")
  .get(categoriesController.getCategory)
  .put(isAdmin, categoriesController.updateCategory)
  .delete(isAdmin, categoriesController.deleteCategory);

export default categoriesRouter;
