import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  approveBooking,
  rejectBooking,
  cancelBooking,
  completeBooking,
} from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/bookings", protect, adminOnly, getAllBookings);
router.put("/:id/approve", protect, adminOnly, approveBooking);
router.put("/:id/reject", protect, adminOnly, rejectBooking);
router.put("/:id/cancel", protect, cancelBooking);
router.put("/:id/complete", protect, adminOnly, completeBooking);

export default router;
