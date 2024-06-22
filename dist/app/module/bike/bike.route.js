"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BikeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const bike_controller_1 = require("./bike.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const bike_validation_1 = require("./bike.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(true), (0, validateRequest_1.default)(bike_validation_1.bikeValidations.createBikeValidationSchema), bike_controller_1.BikeControllers.createBike);
router.get("/", bike_controller_1.BikeControllers.getAllBikes);
router.put("/:id", (0, auth_1.default)(true), (0, validateRequest_1.default)(bike_validation_1.bikeValidations.updateBikeValidationSchema), bike_controller_1.BikeControllers.updateBike);
router.delete("/:id", (0, auth_1.default)(true), bike_controller_1.BikeControllers.deleteBike);
exports.BikeRoutes = router;
