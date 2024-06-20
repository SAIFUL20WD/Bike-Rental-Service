import express from "express";
import auth from "../../middleware/auth";
import { BikeControllers } from "./bike.controller";
import validateRequest from "../../middleware/validateRequest";
import { bikeValidations } from "./bike.validation";

const router = express.Router();

router.post("/", auth(true), validateRequest(bikeValidations.createBikeValidationSchema), BikeControllers.createBike);

router.get("/", BikeControllers.getAllBikes);

router.put("/:id", auth(true), validateRequest(bikeValidations.updateBikeValidationSchema), BikeControllers.updateBike);

router.delete("/:id", auth(true), BikeControllers.deleteBike);

export const BikeRoutes = router;
