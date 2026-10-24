import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    shape: { type: String, enum: ["round", "square", "rectangle", "bench"], default: "round" },
    location: { type: String, default: "Main Hall" },
    floor: { type: String, default: "Ground Floor" },
    // position on the visual floor layout, in percentage (0-100) of the layout canvas
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Table || mongoose.model("Table", tableSchema);
