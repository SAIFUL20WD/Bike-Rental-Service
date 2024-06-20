import express from "express";
import auth from "../../middleware/auth";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userValidations } from "./user.validation";

const router = express.Router();

router.get("/me", auth(false), UserControllers.getUser);

router.put("/me", auth(false), validateRequest(userValidations.updateUserValidationSchema), UserControllers.updateUser);

export const UserRoutes = router;
