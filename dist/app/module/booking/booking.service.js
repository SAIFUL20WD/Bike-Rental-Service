"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingServices = void 0;
const booking_model_1 = __importDefault(require("./booking.model"));
const bike_model_1 = __importDefault(require("../bike/bike.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const createBikeRentalIntoDB = (userId, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = yield bike_model_1.default.findById(payLoad.bikeId);
    if (!bike) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No Bike found");
    }
    else if (!bike.isAvailable) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Bike is currently unavailable");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const updatedBike = yield bike_model_1.default.findByIdAndUpdate(bike._id, { isAvailable: false }, { new: true, session: session });
        if (!updatedBike) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create rental");
        }
        const bookingData = {
            userId: userId,
            bikeId: payLoad.bikeId,
            startTime: payLoad.startTime,
        };
        const booking = yield booking_model_1.default.create([bookingData], { session: session });
        if (!booking) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create rental");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return booking;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create rental");
    }
});
const returnBikeIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.default.findById(id);
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No Booking found");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const bike = yield bike_model_1.default.findById(booking.bikeId);
        if (!bike) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Bike not found");
        }
        const costPerMinute = Math.round((bike === null || bike === void 0 ? void 0 : bike.pricePerHour) / 60);
        // Calculate Cost Per Minute From Rent Time
        const returnTime = new Date();
        const returnTimeFormat = returnTime.toISOString().slice(0, 19) + "Z";
        const startTime = new Date(booking.startTime);
        const differenceMs = returnTime.getTime() - startTime.getTime();
        const minutes = differenceMs / (1000 * 60);
        const rentTime = Math.floor(minutes);
        const totalCost = Math.round(rentTime * costPerMinute);
        const updatedBookingData = {
            returnTime: returnTimeFormat,
            totalCost: totalCost,
            isReturned: true,
        };
        const updatedBooking = yield booking_model_1.default.findByIdAndUpdate(booking._id, updatedBookingData, {
            new: true,
            session: session,
        });
        if (!updatedBooking) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update rental");
        }
        const updatedBike = yield bike_model_1.default.findByIdAndUpdate(booking.bikeId, { isAvailable: true }, { new: true, session: session });
        if (!updatedBike) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update rental");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return updatedBooking;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update rental");
    }
});
const getAllRentalsFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const rentals = yield booking_model_1.default.findById(userId);
    return rentals;
});
exports.BookingServices = {
    createBikeRentalIntoDB,
    returnBikeIntoDB,
    getAllRentalsFromDB,
};
