import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TBike } from "./bike.interface";
import Bike from "./bike.model";

const createBikeIntoDB = async (payLoad: TBike) => {
    const bike = await Bike.create(payLoad);
    return bike;
};

const getAllBikesFromDB = async () => {
    const bikes = await Bike.find({});
    return bikes;
};

const updateBikeIntoDB = async (id: string, payLoad: Partial<TBike>) => {
    const bike = await Bike.findByIdAndUpdate(id, payLoad, { new: true });

    if (!bike) {
        throw new AppError(httpStatus.NOT_FOUND, "Bike not found");
    }
    return bike;
};

const deleteBikeFromDB = async (id: string) => {
    const bike = await Bike.findByIdAndUpdate(id, { isAvailable: false }, { new: true });

    if (!bike) {
        throw new AppError(httpStatus.NOT_FOUND, "Bike not found");
    }
    return bike;
};

export const BikeServices = {
    createBikeIntoDB,
    getAllBikesFromDB,
    updateBikeIntoDB,
    deleteBikeFromDB,
};
