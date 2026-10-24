import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    cartItems: { type: Object, default: {} },
    // Password-reset support: a hashed, single-use, time-limited token.
    // We store a SHA-256 hash (not the raw token) so a DB leak alone can't
    // be used to reset anyone's password.
    reset_password_token: { type: String, default: null },
    reset_password_expires: { type: Date, default: null },
  },
  { timestamps: true, minimize: false }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
