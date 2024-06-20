import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";

const createBikeRental = catchAsync(async (req, res) => {
    const { _id: userId } = req.user;
    const result = await BookingServices.createBikeRentalIntoDB(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rental created successfully",
        data: result,
    });
});

const returnBike = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BookingServices.returnBikeIntoDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bike returned successfully",
        data: result,
    });
});

const getAllRentals = catchAsync(async (req, res) => {
    const { _id: userId } = req.user;
    const result = await BookingServices.getAllRentalsFromDB(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rentals retrieved successfully",
        data: result,
    });
});

export const BookingControllers = {
    createBikeRental,
    returnBike,
    getAllRentals,
};
