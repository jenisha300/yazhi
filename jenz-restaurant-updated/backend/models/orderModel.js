import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    address: {
      name: String,
      phone: String,
      email: String,
      street: String,
      city: String,
    },
    paymentMethod: { type: String, enum: ["COD", "PayAtRestaurant", "Online"], default: "COD" },
    isPaid: { type: Boolean, default: false },
    note: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
