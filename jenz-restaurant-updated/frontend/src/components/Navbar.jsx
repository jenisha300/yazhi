import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Menu as MenuIcon, X, UserCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import Logo from "./brand/Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/menu", label: "Menu" },
  { to: "/book-table", label: "Book Table" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { user, logout, cartItems } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 text-cream transition-all duration-300 ${
        scrolled ? "bg-charcoal/95 backdrop-blur shadow-lg" : "bg-charcoal"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <Logo size="sm" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl tracking-wide text-gold">Yāzhi</span>
            <span className="font-tamil text-[11px] text-cream/60 tracking-[0.2em]">யாழி</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative py-1 transition-colors hover:text-gold ${
                  isActive ? "text-gold" : "text-cream/90"
                } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 ${
                  isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <Link to="/cart" className="relative hover:text-gold transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4 text-sm">
              <Link to="/my-bookings" className="hover:text-gold transition-colors">My Bookings</Link>
              <Link to="/my-orders" className="hover:text-gold transition-colors">My Orders</Link>
              <button onClick={logout} className="flex items-center gap-1 hover:text-gold transition-colors">
                <UserCircle size={18} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-gold px-5 py-2 text-sm">
              Login
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-charcoal border-t border-white/10 px-4 pb-5 flex flex-col gap-4 text-sm animate-fade-in">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="hover:text-gold">
              {l.label}
            </Link>
          ))}
          <Link to="/cart" onClick={() => setOpen(false)}>Cart ({cartCount})</Link>
          {user ? (
            <>
              <Link to="/my-bookings" onClick={() => setOpen(false)}>My Bookings</Link>
              <Link to="/my-orders" onClick={() => setOpen(false)}>My Orders</Link>
              <button onClick={logout} className="text-left">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="btn-gold w-fit px-5 py-2 text-sm">
              Login / Signup
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
