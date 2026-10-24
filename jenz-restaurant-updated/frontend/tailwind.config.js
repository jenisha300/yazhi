/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Yāzhi — Tamil Heritage palette ----
        // Token names kept identical to the original theme so every existing
        // component (btn-gold, card-premium, text-gold, bg-charcoal-gradient…)
        // automatically re-skins from a single source of truth.
        charcoal: "#0F1420",       // Midnight Deep — primary dark background
        charcoal2: "#1A2036",      // Midnight — secondary dark tone
        cream: "#FBF3E7",          // Ivory — main light surface
        ivory: "#FFFBF4",          // Ivory — lighter neutral surface
        gold: "#B8863B",           // Temple Brass — primary accent
        goldLight: "#E4C077",      // Brass Light — metallic highlight
        goldDark: "#8C6526",       // Deep Brass — darker accent / text-on-light
        burgundy: "#A11D2E",       // Kungum Red — controlled accent
        burgundyLight: "#C23245",  // Kungum Red, lighter
        terracotta: "#BE6A45",     // Terracotta — warm South Indian earth tone
        terracottaLight: "#D98F6C",
        banana: "#2F5233",         // Banana Leaf — deep natural green
        bananaLight: "#4C7A52",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
        tamil: ["Catamaran", "Noto Sans Tamil", "sans-serif"],
        tamilDisplay: ["Baloo Thambi 2", "Noto Sans Tamil", "sans-serif"],
      },
      boxShadow: {
        premium: "0 20px 45px -15px rgba(15,20,32,0.35)",
        gold: "0 10px 30px -8px rgba(184,134,59,0.45)",
        brass: "0 10px 30px -8px rgba(184,134,59,0.45)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E4C077 0%, #B8863B 50%, #8C6526 100%)",
        "brass-gradient": "linear-gradient(135deg, #E4C077 0%, #B8863B 50%, #8C6526 100%)",
        "charcoal-gradient": "linear-gradient(160deg, #1A2036 0%, #0F1420 100%)",
        "midnight-gradient": "linear-gradient(160deg, #1A2036 0%, #0F1420 100%)",
        "terracotta-gradient": "linear-gradient(135deg, #D98F6C 0%, #BE6A45 100%)",
        "kolam-fade": "linear-gradient(180deg, transparent 0%, rgba(184,134,59,0.06) 50%, transparent 100%)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        kolamDrift: {
          "0%, 100%": { transform: "translateY(0px)", opacity: 0.5 },
          "50%": { transform: "translateY(-14px)", opacity: 0.8 },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fadeIn 0.8s ease both",
        "float-slow": "floatSlow 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "kolam-drift": "kolamDrift 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
