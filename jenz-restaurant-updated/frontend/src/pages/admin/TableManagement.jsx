import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext";
import TableLayout from "../../components/TableLayout";

const emptyForm = { tableNumber: "", capacity: 4, shape: "round", location: "", floor: "Ground Floor", position: { x: 50, y: 50 }, active: true };

// Admin table management: add / edit / deactivate tables. Any change here is
// immediately reflected on the customer-facing seating selector because both
// read from the same GET /api/tables endpoint - there is no separate copy.
const TableManagement = () => {
  const { axios } = useApp();
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = () => {
  axios.get("/api/tables").then(({ data }) => data.success && setTables(data.tables));
};
useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/tables/${editingId}`, form);
        toast.success("Table updated");
      } else {
        await axios.post("/api/tables", form);
        toast.success("Table added");
      }
      setForm(emptyForm); setEditingId(null); load();
    } catch (error) { toast.error(error.response?.data?.message || "Failed"); }
  };

  const edit = (t) => { setEditingId(t._id); setForm(t); };
  const deactivate = async (id) => { await axios.delete(`/api/tables/${id}`); toast.success("Table deactivated"); load(); };

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Table Management</h1>
      <p className="font-tamil text-goldDark/60 text-xs uppercase tracking-widest mb-6">மேசைகள்</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2 text-sm">Live Floor Preview</h3>
          <TableLayout tables={tables} onSelect={() => {}} />
        </div>

        <div>
          <form onSubmit={submit} className="card-premium p-5 grid grid-cols-2 gap-3 mb-6">
            <input required placeholder="Table Number (e.g. T09)" value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} className="border rounded-lg px-3 py-2 text-sm col-span-2" />
            <input required type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} className="border rounded-lg px-3 py-2 text-sm" />
            <select value={form.shape} onChange={(e) => setForm({ ...form, shape: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
              <option value="round">Round</option>
              <option value="square">Square</option>
              <option value="rectangle">Rectangle</option>
              <option value="bench">Bench</option>
            </select>
            <input placeholder="Location (e.g. Window Side)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="border rounded-lg px-3 py-2 text-sm col-span-2" />
            <input type="number" placeholder="Position X %" value={form.position.x} onChange={(e) => setForm({ ...form, position: { ...form.position, x: Number(e.target.value) } })} className="border rounded-lg px-3 py-2 text-sm" />
            <input type="number" placeholder="Position Y %" value={form.position.y} onChange={(e) => setForm({ ...form, position: { ...form.position, y: Number(e.target.value) } })} className="border rounded-lg px-3 py-2 text-sm" />
            <button className="bg-charcoal text-cream px-5 py-2 rounded-lg text-sm col-span-2">{editingId ? "Update Table" : "Add Table"}</button>
          </form>

          <div className="card-premium divide-y">
            {tables.map((t) => (
              <div key={t._id} className="flex justify-between items-center px-4 py-3 text-sm">
                <span>{t.tableNumber} — {t.capacity} seats — {t.location} {!t.active && "(inactive)"}</span>
                <div className="flex gap-3">
                  <button onClick={() => edit(t)} className="text-blue-600 text-xs">Edit</button>
                  <button onClick={() => deactivate(t._id)} className="text-red-500 text-xs">Deactivate</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TableManagement;
