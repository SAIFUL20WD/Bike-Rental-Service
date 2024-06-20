import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const getUser = catchAsync(async (req, res) => {
    const { _id: userId } = req.user;
    const result = await UserServices.getUserFromDB(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: result,
    });
});

const updateUser = catchAsync(async (req, res) => {
    const { _id: userId } = req.user;
    const result = await UserServices.updateUserIntoDB(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});

export const UserControllers = {
    getUser,
    updateUser,
};
