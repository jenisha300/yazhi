import { useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import TamilTag from "../components/brand/TamilTag";
import { KolamDivider } from "../components/brand/KolamMotif";

const RESTAURANT_ADDRESS = "34 Nehru Street, Kalpalayam, Vinayagapuram, Chennai - 600099, Tamil Nadu, India";
const MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(RESTAURANT_ADDRESS)}&output=embed`;

const Contact = () => {
  const { axios } = useApp();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/contact", form);
      if (data.success) {
        toast.success(data.message);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send message");
    }
  };

  return (
    <div className="bg-ivory">
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <TamilTag en="We'd Love to Hear From You" ta="தொடர்பு கொள்ளுங்கள்" className="mb-3" />
          <h1 className="section-title mb-3">Get in Touch</h1>
          <KolamDivider />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="space-y-4 text-sm mb-6">
              <p className="flex items-center gap-3 card-premium px-4 py-3"><MapPin size={16} className="text-goldDark"/> {RESTAURANT_ADDRESS}</p>
              <p className="flex items-center gap-3 card-premium px-4 py-3"><Phone size={16} className="text-goldDark"/> +91 98765 43210</p>
              <p className="flex items-center gap-3 card-premium px-4 py-3"><Mail size={16} className="text-goldDark"/> hello@yazhirestaurant.com</p>
              <p className="flex items-center gap-3 card-premium px-4 py-3"><Clock size={16} className="text-goldDark"/> Monday – Sunday, 11:00 AM – 11:00 PM</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-premium h-64">
              <iframe
                title="Yāzhi Restaurant Location"
                src={MAPS_EMBED_SRC}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <form onSubmit={submit} className="card-premium p-7 space-y-4 h-fit">
            {["name", "email", "phone", "subject"].map((f) => (
              <input key={f} required={f !== "phone" && f !== "subject"} placeholder={f[0].toUpperCase() + f.slice(1)}
                value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                className="input-premium" />
            ))}
            <textarea required placeholder="Message" rows={4} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="input-premium" />
            <button className="w-full btn-dark py-3">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Contact;
