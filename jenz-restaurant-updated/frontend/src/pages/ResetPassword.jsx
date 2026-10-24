import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import PasswordInput from "../components/PasswordInput";
import Logo from "../components/brand/Logo";

const ResetPassword = () => {
  const { token } = useParams();
  const { resetPassword } = useApp();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/"), 1800);
    } else {
      setError(result.error || "This link is invalid or has expired.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-cream to-ivory">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <Logo size="md" className="mx-auto mb-4" />
          <p className="eyebrow mb-2">Account Recovery</p>
          <h1 className="font-display text-3xl md:text-4xl">Reset Password</h1>
          <div className="divider-gold mx-auto mt-4" />
        </div>

        <div className="card-premium p-7">
          {success ? (
            <div className="text-center py-4 space-y-4 animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="font-display text-xl">Password Updated</h2>
              <p className="text-sm text-charcoal/60">You're logged in. Redirecting you to the homepage...</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <p className="text-sm text-charcoal/60 leading-relaxed">
                Choose a new password for your account.
              </p>
              <div>
                <label className="text-xs font-semibold text-charcoal/60 mb-1 block">New Password</label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal/60 mb-1 block">Confirm New Password</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                  <XCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button disabled={loading} className="w-full btn-dark py-3 rounded-full disabled:opacity-60">
                {loading ? "Updating..." : "Reset Password"}
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

export default ResetPassword;
