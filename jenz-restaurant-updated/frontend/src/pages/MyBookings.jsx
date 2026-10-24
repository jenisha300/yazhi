import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";
import BookingStatus from "../components/BookingStatus";
import LoadingSpinner from "../components/LoadingSpinner";

const MyBookings = () => {
  const { axios } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    axios.get("/api/booking/my-bookings").then(({ data }) => data.success && setBookings(data.bookings)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const cancel = async (id) => {
    try {
      const { data } = await axios.put(`/api/booking/${id}/cancel`);
      if (data.success) { toast.success(data.message); load(); }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not cancel");
    }
  };

  if (loading) return <LoadingSpinner label="Loading your bookings..." />;

  if (bookings.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-charcoal/60 mb-4">You haven't made any reservations yet.</p>
        <Link to="/book-table" className="bg-charcoal text-cream px-6 py-2.5 rounded-full">Book a Table</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-6">My Bookings</h1>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b._id} className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center flex-wrap gap-3">
            <div className="text-sm">
              <p className="font-semibold">Table {b.tableNumber} · {b.numberOfPeople} Guests</p>
              <p className="text-charcoal/60">{new Date(b.date).toLocaleDateString()} · {b.startTime} – {b.endTime}</p>
              {b.note && <p className="text-charcoal/50 text-xs mt-1">Note: {b.note}</p>}
            </div>
            <div className="flex items-center gap-3">
              <BookingStatus status={b.status} />
              {["Pending", "Approved"].includes(b.status) && (
                <button onClick={() => cancel(b._id)} className="text-xs text-red-500 underline">Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyBookings;
