import { Schema, model } from "mongoose";
import { TBooking } from "./booking.interface";

const bookingSchema = new Schema<TBooking>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "user" },
        bikeId: { type: Schema.Types.ObjectId, required: true, ref: "bike" },
        startTime: { type: String, required: true },
        returnTime: { type: String, default: null },
        totalCost: { type: Number, default: 0 },
        isReturned: { type: Boolean, default: false },
    },
    { versionKey: false },
);

const Booking = model("booking", bookingSchema);

export default Booking;
