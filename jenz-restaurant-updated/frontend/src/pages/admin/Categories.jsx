import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext";

const Categories = () => {
  const { axios } = useApp();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const load = () => {
  axios.get("/api/categories").then(({ data }) => data.success && setCategories(data.categories));
};
useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/categories", { name });
      if (data.success) { toast.success(data.message); setName(""); load(); }
    } catch (error) { toast.error(error.response?.data?.message || "Failed to add"); }
  };

  const toggle = async (c) => {
    await axios.put(`/api/categories/${c._id}`, { active: !c.active });
    load();
  };

  const remove = async (id) => {
    await axios.delete(`/api/categories/${id}`);
    toast.success("Category deleted");
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Categories</h1>
      <p className="font-tamil text-goldDark/60 text-xs uppercase tracking-widest mb-6">வகைகள்</p>
      <form onSubmit={add} className="flex gap-3 mb-6">
        <input required placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm flex-1" />
        <button className="bg-charcoal text-cream px-5 rounded-lg text-sm">Add</button>
      </form>
      <div className="card-premium divide-y">
        {categories.map((c) => (
          <div key={c._id} className="flex justify-between items-center px-4 py-3">
            <span>{c.name}</span>
            <div className="flex gap-3 items-center text-sm">
              <button onClick={() => toggle(c)} className={c.active ? "text-green-600" : "text-gray-400"}>
                {c.active ? "Active" : "Inactive"}
              </button>
              <button onClick={() => remove(c._id)} className="text-red-500 text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Categories;
