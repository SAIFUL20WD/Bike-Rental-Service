import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
// import User from "../module/user/user.model";

const auth = (isAdmin: boolean) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
        }

        const decoded = jwt.verify(token, config.jwtSecretKey as string) as JwtPayload;

        const { role } = decoded;

        // const user = await User.findById(_id);

        // if (!user) {
        //     throw new AppError(httpStatus.NOT_FOUND, "No user account found !");
        // }

        if (isAdmin) {
            if (role !== "admin") {
                throw new AppError(httpStatus.UNAUTHORIZED, "You have no access to this route");
            }
        }

        req.user = decoded as JwtPayload;

        next();
    });
};

export default auth;
