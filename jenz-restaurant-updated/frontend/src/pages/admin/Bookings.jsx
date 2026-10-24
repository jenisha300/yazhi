import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext";
import BookingStatus from "../../components/BookingStatus";

const Bookings = () => {
  const { axios } = useApp();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState({ status: "", search: "" });

  const load = () => {
    axios.get("/api/booking/bookings", { params: filter }).then(({ data }) => data.success && setBookings(data.bookings));
  };
  useEffect(load, [filter.status]);

  const act = async (id, action) => {
    try {
      const { data } = await axios.put(`/api/booking/${id}/${action}`);
      if (data.success) { toast.success(data.message); load(); }
    } catch (error) { toast.error(error.response?.data?.message || "Action failed"); }
  };

  const filtered = bookings.filter((b) =>
    !filter.search || b.name.toLowerCase().includes(filter.search.toLowerCase()) || b.tableNumber.toLowerCase().includes(filter.search.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Table Reservations</h1>
      <p className="font-tamil text-goldDark/60 text-xs uppercase tracking-widest mb-6">முன்பதிவுகள்</p>

      <div className="flex flex-wrap gap-3 mb-5">
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          {["Pending", "Approved", "Rejected", "Cancelled", "Completed"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input placeholder="Search name or table..." value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]" />
      </div>

      <div className="space-y-3">
        {filtered.map((b) => (
          <div key={b._id} className="card-premium p-4 flex justify-between items-center flex-wrap gap-3 text-sm">
            <div>
              <p className="font-semibold">{b.name} — Table {b.tableNumber} ({b.numberOfPeople} guests)</p>
              <p className="text-charcoal/50 text-xs">{b.email} · {b.phone}</p>
              <p className="text-charcoal/50 text-xs">{new Date(b.date).toLocaleDateString()} · {b.startTime}–{b.endTime}</p>
              {b.note && <p className="text-charcoal/50 text-xs italic">"{b.note}"</p>}
            </div>
            <div className="flex items-center gap-2">
              <BookingStatus status={b.status} />
              {b.status === "Pending" && (
                <>
                  <button onClick={() => act(b._id, "approve")} className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-full">Approve</button>
                  <button onClick={() => act(b._id, "reject")} className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full">Reject</button>
                </>
              )}
              {b.status === "Approved" && (
                <button onClick={() => act(b._id, "complete")} className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full">Complete</button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-charcoal/40 text-sm">No reservations found.</p>}
      </div>
    </div>
  );
};
export default Bookings;
