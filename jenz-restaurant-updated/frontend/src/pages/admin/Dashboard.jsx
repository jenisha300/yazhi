import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";

const StatCard = ({ label, value }) => (
  <div className="card-premium p-5">
    <p className="text-xs text-charcoal/50">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const { axios } = useApp();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    (async () => {
      const [orders, bookings, tables, menus, categories] = await Promise.all([
        axios.get("/api/orders").catch(() => ({ data: { orders: [] } })),
        axios.get("/api/booking/bookings").catch(() => ({ data: { bookings: [] } })),
        axios.get("/api/tables").catch(() => ({ data: { tables: [] } })),
        axios.get("/api/menu").catch(() => ({ data: { menus: [] } })),
        axios.get("/api/categories").catch(() => ({ data: { categories: [] } })),
      ]);

      const o = orders.data.orders || [];
      const b = bookings.data.bookings || [];
      const t = tables.data.tables || [];
      const today = new Date().toDateString();

      setStats({
        totalOrders: o.length,
        totalRevenue: o.reduce((s, x) => s + (x.amount || 0), 0),
        totalMenuItems: (menus.data.menus || []).length,
        totalCategories: (categories.data.categories || []).length,
        totalReservations: b.length,
        pendingReservations: b.filter((x) => x.status === "Pending").length,
        approvedReservations: b.filter((x) => x.status === "Approved").length,
        todaysReservations: b.filter((x) => new Date(x.date).toDateString() === today).length,
        totalTables: t.length,
      });
      setRecentOrders(o.slice(0, 5));
      setRecentBookings(b.slice(0, 5));
    })();
  }, []);

  if (!stats) return <p className="text-sm text-charcoal/50">Loading dashboard...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Dashboard</h1>
      <p className="font-tamil text-goldDark/60 text-xs uppercase tracking-widest mb-6">நிர்வாகம்</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue}`} />
        <StatCard label="Menu Items" value={stats.totalMenuItems} />
        <StatCard label="Categories" value={stats.totalCategories} />
        <StatCard label="Total Reservations" value={stats.totalReservations} />
        <StatCard label="Pending Reservations" value={stats.pendingReservations} />
        <StatCard label="Approved Reservations" value={stats.approvedReservations} />
        <StatCard label="Today's Reservations" value={stats.todaysReservations} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-premium p-5">
          <h3 className="font-semibold mb-3">Recent Orders</h3>
          {recentOrders.length === 0 ? <p className="text-sm text-charcoal/40">No orders yet.</p> :
            recentOrders.map((o) => (
              <div key={o._id} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                <span>{o.user?.name || "Customer"}</span><span>₹{o.amount}</span>
              </div>
            ))}
        </div>
        <div className="card-premium p-5">
          <h3 className="font-semibold mb-3">Recent Reservations</h3>
          {recentBookings.length === 0 ? <p className="text-sm text-charcoal/40">No reservations yet.</p> :
            recentBookings.map((b) => (
              <div key={b._id} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                <span>{b.name} · {b.tableNumber}</span><span>{b.status}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
