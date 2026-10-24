import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Cart = () => {
  const { axios, cartItems, updateCartQty } = useApp();
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/menu").then(({ data }) => data.success && setMenus(data.menus));
  }, []);

  const lines = Object.entries(cartItems).map(([id, qty]) => {
    const menu = menus.find((m) => m._id === id);
    return menu ? { menu, qty } : null;
  }).filter(Boolean);

  const total = lines.reduce((sum, l) => sum + l.menu.price * l.qty, 0);

  if (lines.length === 0) {
    return (
      <div className="text-center py-28">
        <p className="text-charcoal/60 mb-5">Your cart is empty.</p>
        <Link to="/menu" className="btn-dark">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="section-title mb-8">Your Cart</h1>
      <div className="space-y-4">
        {lines.map(({ menu, qty }) => (
          <div key={menu._id} className="flex items-center justify-between card-premium p-4">
            <div className="flex items-center gap-4">
              <img src={menu.image?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"} className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <p className="font-semibold">{menu.name}</p>
                <p className="text-sm text-charcoal/50">₹{menu.price}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => updateCartQty(menu._id, qty - 1)} className="w-7 h-7 border rounded-full hover:border-gold hover:text-goldDark transition">-</button>
              <span>{qty}</span>
              <button onClick={() => updateCartQty(menu._id, qty + 1)} className="w-7 h-7 border rounded-full hover:border-gold hover:text-goldDark transition">+</button>
              <button onClick={() => updateCartQty(menu._id, 0)} className="text-xs text-red-500 ml-2 hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8">
        <Link to="/menu" className="text-sm underline hover:text-goldDark transition">Continue Shopping</Link>
        <div className="text-right">
          <p className="text-sm text-charcoal/60">Total</p>
          <p className="text-2xl font-bold text-burgundy">₹{total}</p>
        </div>
      </div>
      <button onClick={() => navigate("/checkout")} className="w-full mt-6 btn-dark py-3">
        Proceed to Checkout
      </button>
    </div>
  );
};
export default Cart;
