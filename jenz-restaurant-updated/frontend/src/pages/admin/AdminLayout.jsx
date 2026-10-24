import { useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { LayoutDashboard, Grid3x3, UtensilsCrossed, ClipboardList, CalendarCheck, Armchair, Menu as MenuIcon, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Logo from "../../components/brand/Logo";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", ta: "நிர்வாகம்", icon: LayoutDashboard },
  { to: "/admin/categories", label: "Categories", ta: "வகைகள்", icon: Grid3x3 },
  { to: "/admin/menus", label: "Menus", ta: "உணவுப்பட்டியல்", icon: UtensilsCrossed },
  { to: "/admin/orders", label: "Orders", ta: "ஆர்டர்கள்", icon: ClipboardList },
  { to: "/admin/bookings", label: "Bookings", ta: "முன்பதிவுகள்", icon: CalendarCheck },
  { to: "/admin/tables", label: "Tables", ta: "மேசைகள்", icon: Armchair },
];

const AdminLayout = () => {
  const { user, loadingUser } = useApp();
  const [open, setOpen] = useState(false);

  if (loadingUser) return null;
  // Frontend redirect is just UX - every admin API route is also protected
  // server-side by the `protect` + `adminOnly` middleware.
  if (!user || user.role !== "admin") return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className={`bg-charcoal text-cream w-60 fixed md:static inset-y-0 z-30 transition-transform ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-5 flex items-center gap-2.5 border-b border-white/10">
          <Logo size="xs" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg text-gold">Yāzhi</span>
            <span className="font-tamil text-[10px] text-cream/50 tracking-widest">நிர்வாகம்</span>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3 mt-3">
          {links.map(({ to, label, ta, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive ? "bg-gold text-charcoal" : "hover:bg-white/10"}`}>
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              <span className="font-tamil text-[10px] opacity-60">{ta}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 md:ml-0">
        <div className="md:hidden flex items-center justify-between bg-charcoal text-cream px-4 py-3">
          <span className="font-display text-gold flex items-center gap-2"><Logo size="xs" /> Yāzhi Admin</span>
          <button onClick={() => setOpen(!open)}>{open ? <X /> : <MenuIcon />}</button>
        </div>
        <main className="p-6 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
