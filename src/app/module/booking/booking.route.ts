import express from "express";
import auth from "../../middleware/auth";
import { BookingControllers } from "./booking.controller";

const router = express.Router();

router.post("/", auth(false), BookingControllers.createBikeRental);

router.put("/:id/return", auth(true), BookingControllers.returnBike);

router.get("/", auth(false), BookingControllers.getAllRentals);

export const BookingRoutes = router;
