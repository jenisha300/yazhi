import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import PasswordInput from "../components/PasswordInput";
import Logo from "../components/brand/Logo";
import { KolamCorner } from "../components/brand/KolamMotif";

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate("/");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-cream to-ivory">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <Logo size="md" className="mx-auto mb-4" />
          <p className="eyebrow mb-2">Welcome Back</p>
          <h1 className="font-display text-3xl md:text-4xl">Sign In to Yāzhi</h1>
          <p className="font-tamil text-goldDark/70 text-sm mt-1">யாழிக்கு வரவேற்கிறோம்</p>
          <div className="divider-gold mx-auto mt-4" />
        </div>

        <form onSubmit={submit} className="card-premium p-7 space-y-4 relative">
          <KolamCorner className="absolute -top-3 -right-3 w-8 h-8 text-gold/40" />
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-charcoal/60 block">Password</label>
              <Link to="/forgot-password" className="text-xs text-burgundy font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>
            <PasswordInput
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <button disabled={loading} className="w-full btn-dark py-3 rounded-full mt-2 disabled:opacity-60">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-charcoal/70">
          No account? <Link to="/signup" className="text-burgundy font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
