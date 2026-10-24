import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import PasswordInput from "../components/PasswordInput";
import Logo from "../components/brand/Logo";
import { KolamCorner } from "../components/brand/KolamMotif";

const Signup = () => {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signup(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) navigate("/");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-cream to-ivory">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <Logo size="md" className="mx-auto mb-4" />
          <p className="eyebrow mb-2">Join Yāzhi</p>
          <h1 className="font-display text-3xl md:text-4xl">Create Account</h1>
          <p className="font-tamil text-goldDark/70 text-sm mt-1">கணக்கை உருவாக்குங்கள்</p>
          <div className="divider-gold mx-auto mt-4" />
        </div>

        <form onSubmit={submit} className="card-premium p-7 space-y-4 relative">
          <KolamCorner className="absolute -top-3 -right-3 w-8 h-8 text-gold/40" />
          <div>
            <label className="text-xs font-semibold text-charcoal/60 mb-1 block">Full Name</label>
            <input
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-premium"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal/60 mb-1 block">Email</label>
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-premium"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal/60 mb-1 block">Password</label>
            <PasswordInput
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters"
              autoComplete="new-password"
            />
          </div>

          <button disabled={loading} className="w-full btn-dark py-3 rounded-full mt-2 disabled:opacity-60">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-charcoal/70">
          Already have an account? <Link to="/login" className="text-burgundy font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};
export default Signup;
