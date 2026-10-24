import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext";

const STATUSES = ["Pending", "Confirmed", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"];

const Orders = () => {
  const { axios } = useApp();
  const [orders, setOrders] = useState([]);

  const load = () => {
  axios.get("/api/orders").then(({ data }) => data.success && setOrders(data.orders));
};
useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`/api/orders/${id}/status`, { status });
    toast.success("Order status updated");
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Orders</h1>
      <p className="font-tamil text-goldDark/60 text-xs uppercase tracking-widest mb-6">ஆர்டர்கள்</p>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="card-premium p-4 flex justify-between items-center flex-wrap gap-3 text-sm">
            <div>
              <p className="font-semibold">{o.user?.name} — ₹{o.amount}</p>
              <p className="text-charcoal/50 text-xs">{o.items.length} items · {new Date(o.createdAt).toLocaleString()}</p>
            </div>
            <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
        {orders.length === 0 && <p className="text-charcoal/40 text-sm">No orders yet.</p>}
      </div>
    </div>
  );
};
export default Orders;
