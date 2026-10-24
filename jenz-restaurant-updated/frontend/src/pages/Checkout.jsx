import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";

const Checkout = () => {
  const { axios, cartItems, user } = useApp();
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ name: user?.name || "", phone: "", email: user?.email || "", street: "", city: "", note: "", paymentMethod: "COD" });

  useEffect(() => {
    axios.get("/api/menu").then(({ data }) => data.success && setMenus(data.menus));
  }, []);

  const lines = Object.entries(cartItems).map(([id, qty]) => {
    const menu = menus.find((m) => m._id === id);
    return menu ? { menu, qty } : null;
  }).filter(Boolean);
  const total = lines.reduce((s, l) => s + l.menu.price * l.qty, 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login first"); return navigate("/login"); }
    try {
      const { data } = await axios.post("/api/orders/create", {
        items: lines.map((l) => ({ menu: l.menu._id, quantity: l.qty, price: l.menu.price })),
        amount: total,
        address: form,
        paymentMethod: form.paymentMethod,
        note: form.note,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/my-orders");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not place order");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="section-title mb-8">Checkout</h1>
      <form onSubmit={placeOrder} className="card-premium p-7 space-y-4">
        {["name", "phone", "email", "street", "city"].map((f) => (
          <div key={f}>
            <label className="text-xs font-semibold capitalize text-charcoal/60">{f}</label>
            <input required value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              className="input-premium mt-1" />
          </div>
        ))}
        <div>
          <label className="text-xs font-semibold text-charcoal/60">Order Notes</label>
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-premium mt-1" />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal/60">Payment Method</label>
          <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="input-premium mt-1">
            <option value="COD">Cash on Delivery</option>
            <option value="PayAtRestaurant">Pay at Restaurant</option>
          </select>
        </div>
        <div className="flex justify-between font-semibold pt-3 border-t">
          <span>Total</span><span className="text-burgundy">₹{total}</span>
        </div>
        <button className="w-full btn-dark py-3">Place Order</button>
      </form>
    </div>
  );
};
export default Checkout;
