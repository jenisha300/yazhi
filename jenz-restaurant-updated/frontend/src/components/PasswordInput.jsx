import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// A drop-in replacement for <input type="password" />.
// Each instance manages its own visibility state independently, so multiple
// password fields on the same page (e.g. password + confirm password) toggle
// separately from one another.
const PasswordInput = ({
  value,
  onChange,
  placeholder = "Password",
  required = true,
  className = "",
  id,
  name,
  autoComplete,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        required={required}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`input-premium pr-11 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-gold transition-colors"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;
