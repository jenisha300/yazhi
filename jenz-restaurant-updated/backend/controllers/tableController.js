import Table from "../models/tableModel.js";
import Booking from "../models/bookingModel.js";

// GET /api/tables  -> full floor layout (used to render the visual seating map)
export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({ active: true }).sort({ tableNumber: 1 });
    res.json({ success: true, tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Utility: convert "HH:MM" + duration minutes -> "HH:MM" end time
const addMinutes = (time, minutes) => {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor((total % (24 * 60)) / 60)
    .toString()
    .padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

// GET /api/tables/available?date=&startTime=&guests=
// Backend is the single source of truth for availability - the frontend never
// decides this from a hardcoded list.
export const getAvailableTables = async (req, res) => {
  try {
    const { date, startTime, guests } = req.query;

    if (!date || !startTime || !guests) {
      return res.status(400).json({ success: false, message: "date, startTime and guests are required" });
    }

    const duration = Number(process.env.RESERVATION_DURATION_MINUTES || 90);
    const requestedStart = startTime;
    const requestedEnd = addMinutes(startTime, duration);

    // 1. Active tables with enough capacity
    const candidateTables = await Table.find({
      active: true,
      capacity: { $gte: Number(guests) },
    }).sort({ tableNumber: 1 });

    // 2. Existing bookings for that date that are still "live" (Pending or Approved)
    //    - Pending is included because we don't want two guests racing for the
    //      same table while the admin hasn't decided yet.
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const activeBookings = await Booking.find({
      date: { $gte: dayStart, $lte: dayEnd },
      status: { $in: ["Pending", "Approved"] },
    });

    // 3. Overlap check: two time ranges [aStart,aEnd) and [bStart,bEnd) overlap
    //    when aStart < bEnd AND bStart < aEnd. This is evaluated PER TABLE so
    //    T01 being booked at 7 PM never blocks T02 at 7 PM.
    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const reqStartMin = toMinutes(requestedStart);
    const reqEndMin = toMinutes(requestedEnd);

    const blockedTableIds = new Set(
      activeBookings
        .filter((b) => {
          const bStart = toMinutes(b.startTime);
          const bEnd = toMinutes(b.endTime);
          return reqStartMin < bEnd && bStart < reqEndMin;
        })
        .map((b) => b.table.toString())
    );

    const availableTables = candidateTables.filter((t) => !blockedTableIds.has(t._id.toString()));
    const unavailableTableIds = candidateTables
      .filter((t) => blockedTableIds.has(t._id.toString()))
      .map((t) => t._id.toString());

    res.json({
      success: true,
      requestedStart,
      requestedEnd,
      availableTables,
      unavailableTableIds,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/tables (admin)
export const addTable = async (req, res) => {
  try {
    const { tableNumber, capacity, shape, location, floor, position } = req.body;
    const exists = await Table.findOne({ tableNumber });
    if (exists) return res.status(400).json({ success: false, message: "Table number already exists" });

    const table = await Table.create({ tableNumber, capacity, shape, location, floor, position });
    res.json({ success: true, message: "Table added", table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/tables/:id (admin)
export const updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!table) return res.status(404).json({ success: false, message: "Table not found" });
    res.json({ success: true, message: "Table updated", table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/tables/:id (admin) - soft delete (deactivate)
export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!table) return res.status(404).json({ success: false, message: "Table not found" });
    res.json({ success: true, message: "Table deactivated", table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
