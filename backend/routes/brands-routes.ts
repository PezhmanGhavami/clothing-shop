import express from "express";

import * as brandsController from "../controllers/brands-controller";
import isAdmin from "../middlewares/admin-middleware";

const brandsRouter = express.Router();

brandsRouter
  .route("/")
  .post(isAdmin, brandsController.addBrand)
  .get(brandsController.getBrands);

brandsRouter
  .route("/:categoryID")
  .get(brandsController.getBrand)
  .put(isAdmin, brandsController.editBrand)
  .delete(isAdmin, brandsController.deleteBrand);

export default brandsRouter;
