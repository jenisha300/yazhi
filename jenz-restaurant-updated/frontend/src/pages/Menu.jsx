import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import MenuCard from "../components/MenuCard";
import LoadingSpinner from "../components/LoadingSpinner";
import TamilTag from "../components/brand/TamilTag";
import { KolamDivider } from "../components/brand/KolamMotif";

const Menu = () => {
  const { axios } = useApp();
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [menuRes, catRes] = await Promise.all([axios.get("/api/menu"), axios.get("/api/categories")]);
        if (menuRes.data.success) setMenus(menuRes.data.menus);
        if (catRes.data.success) setCategories(catRes.data.categories);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = menus.filter((m) => {
    const matchCategory = activeCategory === "All" || m.category?.name === activeCategory;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchVeg = !vegOnly || m.isVeg;
    return matchCategory && matchSearch && matchVeg;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-10 animate-fade-in-up">
        <TamilTag en="Handcrafted With Care" ta="உணவுப்பட்டியல்" className="mb-3" />
        <h1 className="section-title mb-3">Our Menu</h1>
        <KolamDivider />
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between mb-8">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveCategory("All")}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${activeCategory === "All" ? "bg-charcoal text-cream border-charcoal" : "border-charcoal/20 hover:border-gold hover:text-goldDark"}`}>
            All
          </button>
          {categories.map((c) => (
            <button key={c._id} onClick={() => setActiveCategory(c.name)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${activeCategory === c.name ? "bg-charcoal text-cream border-charcoal" : "border-charcoal/20 hover:border-gold hover:text-goldDark"}`}>
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-1.5 text-sm">
            <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} className="accent-gold" /> Veg only
          </label>
          <input placeholder="Search dishes..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-premium rounded-full py-1.5 max-w-[180px]" />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading menu..." />
      ) : filtered.length === 0 ? (
        <p className="text-center text-charcoal/50 py-16">No dishes match your filters.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((item) => <MenuCard key={item._id} item={item} />)}
        </div>
      )}
    </div>
  );
};
export default Menu;
