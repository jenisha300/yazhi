import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";
import TamilTag from "../components/brand/TamilTag";

// Step 1 of the reservation flow: collect booking details, then hand off to
// SelectTable which fetches real availability from the backend.
const BookTable = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    guests: 2,
    date: "",
    time: "19:00",
    note: "",
  });

  const submit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to book a table");
      return navigate("/login");
    }

    const today = new Date().toISOString().split("T")[0];
    if (form.date < today) {
      return toast.error("Booking date cannot be in the past");
    }
    if (form.time < "11:00" || form.time > "23:00") {
  return toast.error("Bookings are only accepted between 11:00 AM and 11:00 PM");
}
    navigate("/select-table", { state: form });
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <TamilTag en="Reserve Your table" align="left" className="mb-2" />
      <p classname="text-charcoal/60 mb-6 text-sm">From heritage to your table.</p>
      <h1 className="font-display text-3xl mb-1">Book a Table</h1>
      <p className="text-charcoal/60 mb-6 text-sm">Step 1 of 4 — Booking Details</p>

      <form onSubmit={submit} className="card-premium p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-semibold">Full Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-premium mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-premium mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">Phone</label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-premium mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">Number of Guests</label>
            <input
              required
              type="number"
              min={1}
              max={20}
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
              className="input-premium mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">Date</label>
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input-premium mt-1"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold">Time (11:00 AM – 11:00 PM)</label>
            <input
              required
              type="time"
              min="11:00"
              max="23:00"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="input-premium mt-1"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold">Special Request (optional)</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="input-premium mt-1"
              rows={2}
            />
          </div>
        </div>

        <button className="w-full btn-dark py-2.5">
          Search Available Tables
        </button>
      </form>
    </div>
  );
};

export default BookTable;
