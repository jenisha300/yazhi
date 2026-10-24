import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext";
import { ImagePlus, Pencil, Trash2, X } from "lucide-react";

const emptyForm = { name: "", description: "", price: "", category: "", isVeg: true, inStock: true };

const Menus = () => {
  const { axios } = useApp();
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const load = async () => {
    const [m, c] = await Promise.all([axios.get("/api/menu"), axios.get("/api/categories")]);
    if (m.data.success) setMenus(m.data.menus);
    if (c.data.success) setCategories(c.data.categories);
  };
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setPreview(null);
    setExistingImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!editingId && !imageFile) {
      toast.error("Please upload a food image");
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("category", form.category);
    fd.append("isVeg", form.isVeg);
    fd.append("inStock", form.inStock);
    if (imageFile) fd.append("images", imageFile);

    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`/api/menu/${editingId}`, fd);
        toast.success("Menu item updated");
      } else {
        await axios.post("/api/menu", fd);
        toast.success("Menu item added");
      }
      resetForm();
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const edit = (m) => {
    setEditingId(m._id);
    setForm({
      name: m.name,
      description: m.description,
      price: m.price,
      category: m.category?._id || "",
      isVeg: m.isVeg,
      inStock: m.inStock,
    });
    setExistingImage(m.image?.[0] || null);
    setImageFile(null);
    setPreview(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    await axios.delete(`/api/menu/${id}`);
    toast.success("Menu item deleted");
    load();
  };

  const displayImage = preview || existingImage;

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Menu Items</h1>
      <p className="font-tamil text-goldDark/60 text-xs uppercase tracking-widest mb-6">உணவுப்பட்டியல்</p>

      <form onSubmit={submit} className="card-premium p-6 grid sm:grid-cols-2 gap-4 mb-8">
        {/* Image upload */}
        <div className="sm:col-span-2 flex items-center gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 rounded-xl border-2 border-dashed border-charcoal/20 hover:border-gold cursor-pointer flex items-center justify-center overflow-hidden bg-cream/40 relative shrink-0 transition"
          >
            {displayImage ? (
              <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <ImagePlus className="text-charcoal/30" size={26} />
            )}
          </div>
          <div className="text-sm">
            <p className="font-semibold mb-1">Food Image {!editingId && <span className="text-red-500">*</span>}</p>
            <p className="text-charcoal/50 text-xs mb-2">JPG or PNG, up to 5MB.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs px-3 py-1.5 rounded-full border border-charcoal/20 hover:border-gold hover:text-goldDark transition"
              >
                {displayImage ? "Change Image" : "Upload Image"}
              </button>
              {imageFile && (
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:border-red-400 transition flex items-center gap-1"
                >
                  <X size={12} /> Remove
                </button>
              )}
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-premium" />
        <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-premium" />
        <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-premium">
          <option value="">Select category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} className="accent-gold" /> Veg</label>
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="accent-gold" /> In Stock</label>
        </div>
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-premium sm:col-span-2" />

        <div className="sm:col-span-2 flex gap-3">
          <button disabled={saving} className="btn-dark px-5 py-2.5 disabled:opacity-60">
            {saving ? "Saving..." : editingId ? "Update Item" : "Add Item"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-full border border-charcoal/20 text-sm hover:border-gold transition">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="card-premium divide-y">
        {menus.map((m) => (
          <div key={m._id} className="flex justify-between items-center px-4 py-3 text-sm gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={m.image?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"}
                alt={m.name}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
              />
              <span className="truncate">{m.name} — ₹{m.price} — {m.category?.name}</span>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => edit(m)} className="text-blue-600 text-xs flex items-center gap-1 hover:underline"><Pencil size={12} /> Edit</button>
              <button onClick={() => remove(m._id)} className="text-red-500 text-xs flex items-center gap-1 hover:underline"><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Menus;
