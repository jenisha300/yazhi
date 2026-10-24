import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import Logo from "../components/brand/Logo";

const ForgotPassword = () => {
  const { forgotPassword } = useApp();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    // Always show the "check your inbox" state, regardless of whether the
    // email exists - the backend intentionally never reveals that either way.
    if (result.success) setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-cream to-ivory">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <Logo size="md" className="mx-auto mb-4" />
          <p className="eyebrow mb-2">Account Recovery</p>
          <h1 className="font-display text-3xl md:text-4xl">Forgot Password</h1>
          <div className="divider-gold mx-auto mt-4" />
        </div>

        <div className="card-premium p-7">
          {submitted ? (
            <div className="text-center py-4 space-y-4 animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="font-display text-xl">Check Your Email</h2>
              <p className="text-sm text-charcoal/60 leading-relaxed">
                If <strong className="text-charcoal">{email}</strong> is registered with us, a password reset link
                is on its way. It expires in 30 minutes and can only be used once.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-burgundy font-semibold hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <p className="text-sm text-charcoal/60 leading-relaxed">
                Enter the email address on your account and we'll send you a link to reset your password.
              </p>
              <div>
                <label className="text-xs font-semibold text-charcoal/60 mb-1 flex items-center gap-1.5">
                  <Mail size={13} /> Email
                </label>
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium"
                />
              </div>
              <button disabled={loading} className="w-full btn-dark py-3 rounded-full disabled:opacity-60">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-charcoal transition">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
