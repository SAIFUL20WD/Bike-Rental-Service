"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "user" },
    bikeId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "bike" },
    startTime: { type: String, required: true },
    returnTime: { type: String, default: null },
    totalCost: { type: Number, default: 0 },
    isReturned: { type: Boolean, default: false },
}, { versionKey: false });
const Booking = (0, mongoose_1.model)("booking", bookingSchema);
exports.default = Booking;
