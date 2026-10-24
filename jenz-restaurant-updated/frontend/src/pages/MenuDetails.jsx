import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";

const MenuDetails = () => {
  const { id } = useParams();
  const { axios, addToCart } = useApp();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios.get(`/api/menu/${id}`).then(({ data }) => data.success && setItem(data.menu));
  }, [id]);

  if (!item) return <LoadingSpinner label="Loading dish..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 animate-fade-in-up">
      <img
        src={item.image?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"}
        className="rounded-2xl w-full h-80 md:h-full object-cover shadow-premium"
        alt={item.name}
      />
      <div className="flex flex-col justify-center">
        <span className={`w-fit text-xs font-semibold px-3 py-1 rounded-full mb-3 ${item.isVeg ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {item.isVeg ? "Veg" : "Non-Veg"}
        </span>
        <h1 className="font-display text-3xl md:text-4xl mb-3">{item.name}</h1>
        <p className="text-charcoal/60 mb-6 leading-relaxed">{item.description}</p>
        <p className="text-3xl font-bold text-burgundy mb-8">₹{item.price}</p>
        <button onClick={() => addToCart(item._id)} disabled={!item.inStock} className="btn-dark w-fit disabled:opacity-40">
          {item.inStock ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
};
export default MenuDetails;
