import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";
import TableLayout from "../components/TableLayout";
import LoadingSpinner from "../components/LoadingSpinner";

// Step 2 & 3: fetch real availability from the backend for the chosen
// date/time/guest count, render the visual floor plan, and let the customer
// click a table. The backend decides availability — this page never guesses.
const SelectTable = () => {
  const { state: form } = useLocation();
  const navigate = useNavigate();
  const { axios, user } = useApp();

  const [allTables, setAllTables] = useState([]);
  const [unavailableIds, setUnavailableIds] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!form) return navigate("/book-table");
    fetchAvailability();
    // eslint-disable-next-line
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/tables/available", {
        params: { date: form.date, startTime: form.time, guests: form.guests },
      });
      if (data.success) {
        setAllTables(data.availableTables || []);
        setUnavailableIds(data.unavailableTableIds || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load table availability");
    } finally {
      setLoading(false);
    }
  };

  // We also fetch the full floor layout so unavailable tables still render (greyed out)
  const [floorTables, setFloorTables] = useState([]);
  useEffect(() => {
    axios.get("/api/tables").then(({ data }) => data.success && setFloorTables(data.tables));
    // eslint-disable-next-line
  }, []);

  const displayTables = floorTables.length ? floorTables : allTables;

  const confirmBooking = async () => {
    if (!selected) return toast.error("Please select a table first");

    try {
      setSubmitting(true);
      const { data } = await axios.post("/api/booking/create", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        numberOfPeople: form.guests,
        tableId: selected._id,
        date: form.date,
        startTime: form.time,
        note: form.note,
      });
      if (data.success) {
        toast.success(data.message);
        if (data.emailWarning) toast.error(data.emailWarning);
        navigate("/booking-success", { state: { booking: data.booking, emailSent: data.emailSent } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create booking");
      fetchAvailability();
    } finally {
      setSubmitting(false);
    }
  };

  if (!form) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-1">Choose Your Table</h1>
      <p className="text-charcoal/60 mb-6 text-sm">
        Step 2 of 4 — {form.guests} guests · {form.date} · {form.time}
      </p>

      {loading ? (
        <LoadingSpinner label="Checking table availability..." />
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <TableLayout
              tables={displayTables}
              unavailableIds={unavailableIds}
              selectedTableId={selected?._id}
              onSelect={setSelected}
            />
            <div className="flex flex-wrap gap-4 mt-4 text-xs">
              <Legend swatch="bg-cream border-gold" label="Available" />
              <Legend swatch="bg-burgundy border-burgundy" label="Selected" />
              <Legend swatch="bg-gray-200 border-gray-300" label="Unavailable / Too Small" />
            </div>
          </div>

          <div className="card-premium p-5 h-fit">
            <h3 className="font-semibold mb-3">Booking Summary</h3>
            {selected ? (
              <div className="text-sm space-y-1 text-charcoal/80">
                <p><span className="font-semibold">Table:</span> {selected.tableNumber}</p>
                <p><span className="font-semibold">Capacity:</span> {selected.capacity} seats</p>
                <p><span className="font-semibold">Location:</span> {selected.location}</p>
                <p><span className="font-semibold">Date:</span> {form.date}</p>
                <p><span className="font-semibold">Time:</span> {form.time}</p>
                <p><span className="font-semibold">Guests:</span> {form.guests}</p>
              </div>
            ) : (
              <p className="text-sm text-charcoal/50">Click a table on the floor plan to select it.</p>
            )}

            <button
              disabled={!selected || submitting}
              onClick={confirmBooking}
              className="w-full mt-5 btn-dark py-2.5 disabled:opacity-40"
            >
              {submitting ? "Submitting..." : "Request Reservation"}
            </button>

            {!user && (
              <p className="text-xs text-center mt-2 text-charcoal/50">
                <Link to="/login" className="underline">Login</Link> required before requesting a reservation.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Legend = ({ swatch, label }) => (
  <div className="flex items-center gap-2">
    <span className={`w-4 h-4 rounded border-2 ${swatch}`} />
    {label}
  </div>
);

export default SelectTable;
