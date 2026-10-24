import Booking from "../models/bookingModel.js";
import Table from "../models/tableModel.js";
import { sendBookingConfirmationEmail } from "../utils/emailService.js";

const addMinutes = (time, minutes) => {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor((total % (24 * 60)) / 60).toString().padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
};
const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// Re-checks, on the server, that a table has no conflicting Pending/Approved
// booking for the requested window. Called both on create and on admin-approve
// so double-booking is impossible even under race conditions.
const hasConflict = async ({ tableId, date, startTime, endTime, ignoreBookingId }) => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const query = {
    table: tableId,
    date: { $gte: dayStart, $lte: dayEnd },
    status: { $in: ["Pending", "Approved"] },
  };
  if (ignoreBookingId) query._id = { $ne: ignoreBookingId };

  const existing = await Booking.find(query);
  const reqStart = toMinutes(startTime);
  const reqEnd = toMinutes(endTime);

  return existing.some((b) => {
    const bStart = toMinutes(b.startTime);
    const bEnd = toMinutes(b.endTime);
    return reqStart < bEnd && bStart < reqEnd;
  });
};

// POST /api/booking/create
export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, numberOfPeople, tableId, date, startTime, note } = req.body;

    if (!name || !email || !phone || !numberOfPeople || !tableId || !date || !startTime) {
      return res.status(400).json({ success: false, message: "Missing required booking fields" });
    }

    const table = await Table.findById(tableId);
    if (!table || !table.active) {
      return res.status(400).json({ success: false, message: "Selected table is not available" });
    }
    if (Number(numberOfPeople) > table.capacity) {
      return res.status(400).json({ success: false, message: "Guest count exceeds table capacity" });
    }

    const duration = Number(process.env.RESERVATION_DURATION_MINUTES || 90);
    const endTime = addMinutes(startTime, duration);

    const conflict = await hasConflict({ tableId, date, startTime, endTime });
    if (conflict) {
      return res.status(409).json({ success: false, message: "Table is already reserved for the selected time" });
    }

    const booking = await Booking.create({
      user: req.user?._id,
      name,
      email,
      phone,
      numberOfPeople,
      table: table._id,
      tableNumber: table.tableNumber,
      date,
      startTime,
      endTime,
      note,
      status: "Pending",
    });

    // The booking is already saved successfully at this point - everything
    // below is "send a confirmation", which must never be allowed to make an
    // otherwise-successful booking look like it failed.
    //
    // Confirmation goes to the authenticated account's REGISTERED email
    // (req.user.email), not whatever was typed into the booking form, per
    // requirement: "use the individual user's registered email from the
    // database/session/authenticated account".
    let emailResult;
    try {
      emailResult = await sendBookingConfirmationEmail({ booking, user: req.user });
    } catch (err) {
      console.error("[BookingController] Confirmation email failed:", err.message);
      emailResult = { success: false, error: err.message };
    }

    res.json({
      success: true,
      message: "Reservation request submitted",
      booking,
      emailSent: Boolean(emailResult?.success),
      emailWarning: emailResult?.success
        ? undefined
        : "Booking confirmed, but we couldn't confirm delivery of the confirmation email. Please check My Bookings for your reservation details.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/booking/my-bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/booking/bookings (admin) - supports ?status=&date=&table=&search=
export const getAllBookings = async (req, res) => {
  try {
    const { status, date, table, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (table) filter.tableNumber = table;
    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      filter.date = { $gte: dayStart, $lte: dayEnd };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const bookings = await Booking.find(filter).populate("table").sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/booking/:id/approve (admin)
export const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    // Verify again at approval time - another table/time may have filled up since request.
    const conflict = await hasConflict({
      tableId: booking.table,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      ignoreBookingId: booking._id,
    });
    if (conflict) {
      return res.status(409).json({ success: false, message: "Another booking already occupies this table/time" });
    }

    booking.status = "Approved";
    await booking.save();
    res.json({ success: true, message: "Booking approved successfully", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/booking/:id/reject (admin)
export const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: "Rejected" }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, message: "Booking rejected", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/booking/:id/cancel (customer or admin)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (!["Pending", "Approved"].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a booking that is already ${booking.status}` });
    }

    booking.status = "Cancelled";
    await booking.save();
    res.json({ success: true, message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/booking/:id/complete (admin)
export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: "Completed" }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, message: "Booking marked completed", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
