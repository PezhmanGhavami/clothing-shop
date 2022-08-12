import express from "express";

import * as brandsController from "../controllers/brands-controller";
import isAdmin from "../middlewares/admin-middleware";

const brandsRouter = express.Router();

brandsRouter
  .route("/")
  .post(isAdmin, brandsController.createBrand)
  .get(brandsController.getBrands);

brandsRouter
  .route("/:brandID")
  .get(brandsController.getBrand)
  .put(isAdmin, brandsController.updateBrand)
  .delete(isAdmin, brandsController.deleteBrand);

export default brandsRouter;
