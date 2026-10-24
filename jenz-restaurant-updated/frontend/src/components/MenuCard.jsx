import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import fallbackImg from "../assets/images/food/biryani.jpg";

const MenuCard = ({ item }) => {
  const { addToCart } = useApp();
  return (
    <div className="card-premium overflow-hidden group">
      <div className="h-44 bg-gray-100 overflow-hidden relative">
        <img
          src={item.image?.[0] || fallbackImg}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
        <span className={`absolute top-3 left-3 w-5 h-5 rounded-md border-2 bg-white/90 flex items-center justify-center ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
          <span className={`block w-2 h-2 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-charcoal font-display text-lg">{item.name}</h3>
        <p className="text-xs text-charcoal/60 line-clamp-2 mt-1 min-h-[2rem]">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-burgundy text-lg">₹{item.price}</span>
          <div className="flex gap-2">
            <Link to={`/menu/${item._id}`} className="text-xs px-3 py-1.5 rounded-full border border-charcoal/20 hover:border-gold hover:text-gold transition">
              Details
            </Link>
            <button
              disabled={!item.inStock}
              onClick={() => addToCart(item._id)}
              className="text-xs px-3 py-1.5 rounded-full bg-charcoal text-cream hover:bg-burgundy transition disabled:opacity-40"
            >
              {item.inStock ? "Add" : "Sold Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
