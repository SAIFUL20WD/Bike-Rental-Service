"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidations = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(3, { message: "Name must must be minimum 3 characters" })
        .max(20, { message: "Name can not be more than 20 characters" }),
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be minimum 8 characters" })
        .max(20, { message: "Password can not be more than 20 characters" }),
    phone: zod_1.z
        .string()
        .trim()
        .min(10, { message: "Phone number must be minimum 10 characters" })
        .max(15, { message: "Phone number not be more than 15 characters" }),
    address: zod_1.z.string(),
    role: zod_1.z.enum(["admin", "user"]),
});
const updateUserValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(3, { message: "Name must must be minimum 3 characters" })
        .max(20, { message: "Name can not be more than 20 characters" })
        .optional(),
    phone: zod_1.z
        .string()
        .trim()
        .min(10, { message: "Phone number must be minimum 10 characters" })
        .max(15, { message: "Phone number not be more than 15 characters" })
        .optional(),
    address: zod_1.z.string().optional(),
});
exports.userValidations = {
    createUserValidationSchema,
    updateUserValidationSchema,
};
