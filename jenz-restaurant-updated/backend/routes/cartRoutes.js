import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

// Cart is stored on the user document as a simple { menuId: quantity } map,
// which keeps the cart in sync across the user's devices.
router.post("/update", protect, async (req, res) => {
  try {
    const { cartItems } = req.body;
    await User.findByIdAndUpdate(req.user._id, { cartItems });
    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    res.json({ success: true, cartItems: req.user.cartItems || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
