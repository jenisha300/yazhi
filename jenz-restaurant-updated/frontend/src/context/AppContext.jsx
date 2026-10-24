import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState({});
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setLoadingUser(false);
      const { data } = await axios.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setUser(data.user);
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        toast.success(data.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
    return { success: false };
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await axios.post("/api/auth/signup", { name, email, password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        toast.success(data.message);
        return { success: true, user: data.user };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
    return { success: false };
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await axios.post("/api/auth/forgot-password", { email });
      if (data.success) {
        toast.success(data.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return { success: false };
    }
    return { success: false };
  };

  const resetPassword = async (token, password) => {
    try {
      const { data } = await axios.post(`/api/auth/reset-password/${token}`, { password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        toast.success(data.message);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Could not reset password";
      toast.error(msg);
      return { success: false, error: msg };
    }
    return { success: false };
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setCartItems({});
      toast.success("Logged out");
    }
  };

  const addToCart = (menuId) => {
    setCartItems((prev) => ({ ...prev, [menuId]: (prev[menuId] || 0) + 1 }));
    toast.success("Added to cart");
  };

  const updateCartQty = (menuId, qty) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (qty <= 0) delete updated[menuId];
      else updated[menuId] = qty;
      return updated;
    });
  };

  const value = {
    user,
    setUser,
    loadingUser,
    login,
    signup,
    forgotPassword,
    resetPassword,
    fetchProfile,
    logout,
    cartItems,
    addToCart,
    updateCartQty,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
