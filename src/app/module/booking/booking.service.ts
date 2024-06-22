import Booking from "./booking.model";
import { TBooking } from "./booking.interface";
import Bike from "../bike/bike.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import mongoose from "mongoose";

const createBikeRentalIntoDB = async (userId: string, payLoad: Partial<TBooking>) => {
    const bike = await Bike.findById(payLoad.bikeId);
    if (!bike) {
        throw new AppError(httpStatus.NOT_FOUND, "No Bike found");
    } else if (!bike.isAvailable) {
        throw new AppError(httpStatus.NOT_FOUND, "Bike is currently unavailable");
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const updatedBike = await Bike.findByIdAndUpdate(
            bike._id,
            { isAvailable: false },
            { new: true, session: session },
        );

        if (!updatedBike) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to create rental");
        }

        const bookingData = {
            userId: userId,
            bikeId: payLoad.bikeId,
            startTime: payLoad.startTime,
        };
        const booking = await Booking.create([bookingData], { session: session });
        if (!booking) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to create rental");
        }

        await session.commitTransaction();
        await session.endSession();

        return booking;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create rental");
    }
};

const returnBikeIntoDB = async (id: string) => {
    const booking = await Booking.findById(id);
    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, "No Booking found");
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const bike = await Bike.findById(booking.bikeId);
        if (!bike) {
            throw new AppError(httpStatus.BAD_REQUEST, "Bike not found");
        }

        const costPerMinute = Math.round((bike?.pricePerHour as number) / 60);

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

        const updatedBooking = await Booking.findByIdAndUpdate(booking._id, updatedBookingData, {
            new: true,
            session: session,
        });
        if (!updatedBooking) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to update rental");
        }

        const updatedBike = await Bike.findByIdAndUpdate(
            booking.bikeId,
            { isAvailable: true },
            { new: true, session: session },
        );
        if (!updatedBike) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to update rental");
        }

        await session.commitTransaction();
        await session.endSession();

        return updatedBooking;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update rental");
    }
};

const getAllRentalsFromDB = async (userId: string) => {
    const rentals = await Booking.find({ userId });
    return rentals;
};

export const BookingServices = {
    createBikeRentalIntoDB,
    returnBikeIntoDB,
    getAllRentalsFromDB,
};
