import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import authRouter from "./routes/authRoutes.js";
import tableRouter from "./routes/tableRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import menuRouter from "./routes/menuRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import cartRouter from "./routes/cartRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

await connectDB();
if (process.env.CLOUDINARY_CLOUD_NAME) {
  await connectCloudinary();
}

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => res.send("Yāzhi Restaurant API is running"));

app.use("/api/auth", authRouter);
app.use("/api/tables", tableRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/menu", menuRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/contact", contactRouter);
app.use("/api/cart", cartRouter);

// central error handler (kept last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong on the server" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
