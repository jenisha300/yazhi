import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    numberOfPeople: { type: Number, required: true },

    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    tableNumber: { type: String, required: true },

    date: { type: Date, required: true },

    startTime: { type: String, required: true }, // "19:00"
    endTime: { type: String, required: true }, // "20:30"

    note: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
