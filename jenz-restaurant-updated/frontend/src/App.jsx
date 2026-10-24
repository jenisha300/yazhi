import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { KolamRail ,LeftWatermark} from "./components/brand/KolamMotif";

import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import MenuDetails from "./pages/MenuDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookTable from "./pages/BookTable";
import SelectTable from "./pages/SelectTable";
import MyBookings from "./pages/MyBookings";
import MyOrders from "./pages/MyOrders";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BookingSuccess from "./pages/BookingSuccess";

import ErrorBoundary from "./components/ErrorBoundary";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Menus from "./pages/admin/Menus";
import Orders from "./pages/admin/Orders";
import Bookings from "./pages/admin/Bookings";
import TableManagement from "./pages/admin/TableManagement";

const App = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Signature, continuous kolam motif — one subtle strip along the right
          edge of the entire site (incl. admin), never overlaying content. */}
      <KolamRail side="right" />
      <LeftWatermark />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#0F1420",
            color: "#FBF3E7",
            border: "1px solid rgba(184,134,59,0.35)",
          },
          iconTheme: { primary: "#B8863B", secondary: "#0F1420" },
        }}
      />
      {!isAdmin && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<MenuDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/book-table" element={<BookTable />} />
          <Route path="/select-table" element={<SelectTable />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-orders" element={<MyOrders />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
            <Route path="categories" element={<ErrorBoundary><Categories /></ErrorBoundary>} />
            <Route path="menus" element={<ErrorBoundary><Menus /></ErrorBoundary>} />
            <Route path="orders" element={<ErrorBoundary><Orders /></ErrorBoundary>} />
            <Route path="bookings" element={<ErrorBoundary><Bookings /></ErrorBoundary>} />
            <Route path="tables" element={<ErrorBoundary><TableManagement /></ErrorBoundary>} />
          </Route>
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
};

export default App;
