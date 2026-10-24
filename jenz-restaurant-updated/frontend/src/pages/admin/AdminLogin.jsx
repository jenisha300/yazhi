import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import PasswordInput from "../../components/PasswordInput";
import Logo from "../../components/brand/Logo";

const AdminLogin = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      // role check happens server-side on every admin API call too -
      // this is just a friendly redirect, never the real gate.
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-gradient flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#c9a24b,transparent_35%),radial-gradient(circle_at_80%_80%,#6b1f2a,transparent_40%)]" />
      <form onSubmit={submit} className="relative bg-white rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-premium animate-fade-in-up">
        <div className="text-center mb-2">
          <Logo size="md" className="mx-auto mb-3" />
          <p className="eyebrow">Restricted Access</p>
          <h1 className="font-display text-2xl mt-1">Yāzhi Admin</h1>
          <p className="font-tamil text-goldDark/70 text-xs mt-1">நிர்வாக அணுகல்</p>
          <div className="divider-gold mx-auto mt-3" />
        </div>
        <input
          required
          type="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input-premium"
        />
        <PasswordInput
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          autoComplete="current-password"
        />
        <button disabled={loading} className="w-full btn-dark py-3 rounded-full disabled:opacity-60">
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
};
export default AdminLogin;
