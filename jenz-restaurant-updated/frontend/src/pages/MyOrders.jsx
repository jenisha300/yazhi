import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";

const MyOrders = () => {
  const { axios } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/orders/my-orders").then(({ data }) => data.success && setOrders(data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading your orders..." />;

  if (orders.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-charcoal/60 mb-4">You haven't placed any orders yet.</p>
        <Link to="/menu" className="bg-charcoal text-cream px-6 py-2.5 rounded-full">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-charcoal/50">{new Date(o.createdAt).toLocaleString()}</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gold/20 text-burgundy">{o.status}</span>
            </div>
            <ul className="text-sm text-charcoal/70 mb-2">
              {o.items.map((it, i) => (
                <li key={i}>{it.quantity} × {it.menu?.name || "Item"}</li>
              ))}
            </ul>
            <p className="font-semibold">Total: ₹{o.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyOrders;
